import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, ArrowRight, Check, AlertCircle, FileType, Database, AlertTriangle, RefreshCw, Wand2, Trash2 } from 'lucide-react';

const IMPORT_TYPES: Record<string, { label: string, fields: string[], required: string[] }> = {
  service: { 
    label: 'Service Records', 
    fields: ['vin', 'date', 'odometer', 'cost', 'description', 'provider'],
    required: ['vin', 'date']
  },
  recalls: { 
    label: 'Recall List', 
    fields: ['vin', 'code', 'description', 'date', 'severity'],
    required: ['vin', 'code']
  },
  kteo: { 
    label: 'KTEO / MOT', 
    fields: ['vin', 'date', 'expiryDate', 'station', 'result'],
    required: ['vin', 'date', 'expiryDate']
  },
  tyres: { 
    label: 'Tyre Checks', 
    fields: ['vin', 'date', 'position', 'brand', 'treadDepth'],
    required: ['vin', 'date']
  },
};

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [importType, setImportType] = useState<string>('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const [processing, setProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: any[];
    invalid: any[];
    duplicates: any[];
    stats: { total: number; success: number; failed: number };
  } | null>(null);

  // Smart Auto-Mapping Effect
  useEffect(() => {
    if (step === 3 && importType && headers.length > 0) {
      const typeConfig = IMPORT_TYPES[importType];
      const newMapping: Record<string, string> = {};
      
      headers.forEach(header => {
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanHeader = normalize(header);

        // Find best match
        const match = typeConfig.fields.find(field => {
          const cleanField = normalize(field);
          // Check for exact matches, containment, or common variations
          return cleanHeader === cleanField || 
                 cleanHeader.includes(cleanField) || 
                 cleanField.includes(cleanHeader) ||
                 (field === 'vin' && (cleanHeader.includes('chassis') || cleanHeader.includes('serial'))) ||
                 (field === 'odometer' && (cleanHeader.includes('km') || cleanHeader.includes('mileage'))) ||
                 (field === 'cost' && (cleanHeader.includes('price') || cleanHeader.includes('amount') || cleanHeader.includes('eur')));
        });

        if (match) {
          newMapping[header] = match;
        }
      });

      // Only set if we found matches and mapping is empty (don't overwrite user changes if they went back)
      if (Object.keys(newMapping).length > 0 && Object.keys(mapping).length === 0) {
        setMapping(newMapping);
      }
    }
  }, [step, importType, headers]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      if (data && data.length > 0) {
        const fileHeaders = data[0] as string[];
        setHeaders(fileHeaders);
        const rows = data.slice(1).map((row: any) => {
          const obj: any = {};
          fileHeaders.forEach((h, i) => {
            obj[h] = row[i];
          });
          return obj;
        });
        setRawData(rows);
        setStep(2);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleMappingChange = (header: string, dbField: string) => {
    setMapping(prev => ({
      ...prev,
      [header]: dbField
    }));
  };

  const clearMapping = () => setMapping({});

  const handleValidate = async () => {
    setProcessing(true);
    
    const payload = {
      data: rawData,
      mapping,
      type: importType
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch('/api/import/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch (err) {
      console.warn('Backend unavailable, running client-side validation logic');
      const results: any = {
        valid: [],
        invalid: [],
        duplicates: [],
        stats: { total: rawData.length, success: 0, failed: 0 }
      };
      
      const config = IMPORT_TYPES[importType];
      const existingKeys = new Set();

      rawData.forEach((row) => {
        const mappedRow: any = {};
        const errors: string[] = [];
        let hasData = false;
        
        Object.keys(mapping).forEach(header => {
          const field = mapping[header];
          if (field && field !== 'skip') {
            mappedRow[field] = row[header];
            hasData = true;
          }
        });

        if (!hasData) return;

        // Normalize
        if (mappedRow.vin) mappedRow.vin = String(mappedRow.vin).toUpperCase().replace(/\s/g, '');

        // Check required
        config.required.forEach(f => {
          if (!mappedRow[f]) errors.push(`Missing ${f}`);
        });

        // Duplicate Check
        const key = `${mappedRow.vin}-${mappedRow.date}`;
        if (existingKeys.has(key)) {
          results.duplicates.push({ row: mappedRow, reason: 'Duplicate in batch' });
          results.stats.failed++;
        } else if (errors.length > 0) {
          results.invalid.push({ row: mappedRow, errors });
          results.stats.failed++;
        } else {
          existingKeys.add(key);
          results.valid.push(mappedRow);
          results.stats.success++;
        }
      });
      
      // Simulate delay
      await new Promise(r => setTimeout(r, 800));
      setValidationResult(results);
    }
    
    setProcessing(false);
    setStep(4);
  };

  const handleCommit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false);
    alert('Import Successfully Committed!');
    setStep(1);
    setFile(null);
    setRawData([]);
    setValidationResult(null);
    setMapping({});
  };

  const getMappedCount = () => Object.values(mapping).filter(v => v !== 'skip' && v !== '').length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Smart Data Import</h1>
        <p className="text-slate-500">Upload Excel, ODS, or CSV files to update your fleet records.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            <span className="text-xs mt-2 font-medium text-slate-500">
              {s === 1 ? 'Upload' : s === 2 ? 'Identify' : s === 3 ? 'Map' : 'Summary'}
            </span>
          </div>
        ))}
        {/* Line */}
        <div className="absolute top-[138px] left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0 hidden md:block" /> 
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your file</h3>
            <p className="text-slate-500 mb-8 max-w-md">
              Drag and drop your Excel (.xlsx), ODS, or CSV file here, or click the button below.
            </p>
            <label className="relative cursor-pointer">
              <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                Select File
              </span>
              <input type="file" className="sr-only" onChange={handleFileUpload} accept=".xlsx,.xls,.csv,.ods" />
            </label>
          </div>
        )}

        {/* Step 2: Declare Type */}
        {step === 2 && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <FileSpreadsheet className="text-green-600" />
              <div>
                <p className="font-medium text-slate-900">{file?.name}</p>
                <p className="text-xs text-slate-500">{headers.length} columns detected, {rawData.length} rows</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">What does this file contain?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'service', label: 'Service Records', icon: Database },
                { id: 'recalls', label: 'Recall List', icon: AlertCircle },
                { id: 'kteo', label: 'KTEO / MOT', icon: FileType },
                { id: 'tyres', label: 'Tyre Checks', icon: Database },
                { id: 'custom', label: 'Create New Type...', icon: FileSpreadsheet },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setImportType(type.id); setStep(3); }}
                  className={`p-4 border rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all group ${
                    importType === type.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200'
                  }`}
                >
                  <type.icon className={`mb-3 w-6 h-6 ${importType === type.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <span className={`font-semibold ${importType === type.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Mapping */}
        {step === 3 && (
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Map Columns
                  {getMappedCount() > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Wand2 size={10} /> {getMappedCount()} Auto-Mapped
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">Match your Excel headers to system fields.</p>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={clearMapping} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                   <Trash2 size={12} /> Clear
                 </button>
                 <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                  {importType}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg mb-6 max-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    {headers.slice(0, 6).map((h, i) => (
                      <th key={i} className={`p-3 text-xs font-bold border-b border-r last:border-r-0 min-w-[180px] ${mapping[h] ? 'bg-blue-50/50' : 'text-slate-500'}`}>
                        <div className="mb-2 truncate" title={h}>{h}</div>
                        <select 
                          className={`w-full text-xs p-2 border rounded font-normal transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${mapping[h] ? 'bg-blue-100 border-blue-400 text-blue-800 font-semibold' : 'bg-white border-slate-300'}`}
                          onChange={(e) => handleMappingChange(h, e.target.value)}
                          value={mapping[h] || ""}
                        >
                          <option value="">Skip Column</option>
                          {IMPORT_TYPES[importType]?.fields.map(f => {
                            const isReq = IMPORT_TYPES[importType].required.includes(f);
                            return (
                              <option key={f} value={f}>
                                {f.replace(/_/g, ' ').toUpperCase()} {isReq ? '*' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {rawData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                      {headers.slice(0, 6).map((h, cIdx) => (
                        <td key={cIdx} className={`p-3 border-r last:border-r-0 truncate max-w-[180px] text-xs ${mapping[h] ? 'bg-blue-50/10 text-slate-800' : 'text-slate-500'}`}>
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
               <div>
                  * Required fields for {IMPORT_TYPES[importType]?.label}
               </div>
               <div className="flex justify-end gap-3">
                <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Back
                </button>
                <button 
                  onClick={handleValidate}
                  disabled={processing || getMappedCount() === 0}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 ${processing || getMappedCount() === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {processing ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                  {processing ? 'Validating...' : 'Run Import'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && validationResult && (
          <div className="p-8 h-full">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Import Summary</h2>
                {validationResult.stats.failed === 0 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                    <Check size={14} /> Ready to Import
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold flex items-center gap-1">
                    <AlertTriangle size={14} /> Issues Found
                  </span>
                )}
             </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">{validationResult.stats.total}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Records</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-700">{validationResult.stats.success}</div>
                <div className="text-xs text-green-600 uppercase tracking-wide font-semibold">Valid</div>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="text-3xl font-bold text-red-700">{validationResult.stats.failed}</div>
                <div className="text-xs text-red-600 uppercase tracking-wide font-semibold">Invalid / Duplicates</div>
              </div>
            </div>

            {/* Error Log */}
            {(validationResult.invalid.length > 0 || validationResult.duplicates.length > 0) && (
              <div className="mb-8">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  Issues Log
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[200px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                      <tr>
                        <th className="px-4 py-2">Row</th>
                        <th className="px-4 py-2">Issue Type</th>
                        <th className="px-4 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {validationResult.duplicates.map((item, i) => (
                        <tr key={`dup-${i}`} className="bg-amber-50/50">
                          <td className="px-4 py-2 font-mono text-xs">{item.row.vin || 'N/A'}</td>
                          <td className="px-4 py-2 text-amber-700 font-medium">Duplicate</td>
                          <td className="px-4 py-2 text-slate-600">{item.reason}</td>
                        </tr>
                      ))}
                      {validationResult.invalid.map((item, i) => (
                        <tr key={`inv-${i}`} className="bg-red-50/50">
                          <td className="px-4 py-2 font-mono text-xs">{item.row.vin || 'N/A'}</td>
                          <td className="px-4 py-2 text-red-700 font-medium">Validation Error</td>
                          <td className="px-4 py-2 text-slate-600">{item.errors.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">Invalid records will be skipped during import.</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => { setStep(1); setFile(null); }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCommit}
                disabled={processing || validationResult.stats.success === 0}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 ${processing || validationResult.stats.success === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processing ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                {processing ? 'Importing...' : 'Commit Import'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}