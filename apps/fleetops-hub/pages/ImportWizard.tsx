import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, ArrowRight, Check, AlertCircle, FileType, Database } from 'lucide-react';

export default function ImportWizard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importType, setImportType] = useState<string>('');
  const [importStats, setImportStats] = useState({ total: 0, passed: 0, failed: 0 });

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
        setHeaders(data[0] as string[]);
        setPreviewData(data.slice(1, 6)); // Preview first 5 rows
        setStep(2);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleSimulateImport = () => {
    // Mock simulation
    const total = Math.floor(Math.random() * 50) + 10;
    setImportStats({
      total: total,
      passed: total - 2,
      failed: 2
    });
    setStep(4);
  };

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
                <p className="text-xs text-slate-500">{headers.length} columns detected</p>
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
              <h3 className="text-lg font-bold text-slate-900">Map Columns</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                {importType}
              </span>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg mb-6">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {headers.slice(0, 5).map((h, i) => (
                      <th key={i} className="p-3 text-xs font-bold text-slate-500 border-b border-r last:border-r-0">
                        {h} <br/>
                        <select className="mt-1 w-full text-xs p-1 border rounded text-slate-900 font-normal">
                          <option>Skip</option>
                          <option>VIN</option>
                          <option>Plate</option>
                          <option>Date</option>
                          <option>Cost</option>
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      {row.slice(0, 5).map((cell: any, cIdx: number) => (
                        <td key={cIdx} className="p-3 text-slate-600 border-r last:border-r-0 truncate max-w-[150px]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                Back
              </button>
              <button 
                onClick={handleSimulateImport}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                Run Import <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Import Complete</h2>
            <p className="text-slate-500 mb-8">Your data has been processed successfully.</p>

            <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-8">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{importStats.total}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Processed</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{importStats.passed}</div>
                <div className="text-xs text-green-600 uppercase tracking-wide">Success</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">{importStats.failed}</div>
                <div className="text-xs text-red-600 uppercase tracking-wide">Failed</div>
              </div>
            </div>

            <button 
              onClick={() => { setStep(1); setFile(null); }}
              className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Import Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
