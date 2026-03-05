import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function ImportPage() {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      setHeaders(data[0] as string[]);
      setFileData(data.slice(1));
      setStep(2);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Smart Excel Import</h1>
      
      {step === 1 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <span>Upload Excel/CSV</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".xlsx,.xls,.csv" />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">Drag and drop or click to select</p>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl mb-4">Declare Data Type</h2>
          <div className="grid grid-cols-3 gap-4">
             {['Service Records', 'KTEO/MOT', 'Tyres', 'Recalls'].map(type => (
               <button key={type} className="p-4 border rounded hover:bg-blue-50 text-left font-medium" onClick={() => setStep(3)}>
                 {type}
               </button>
             ))}
          </div>
        </div>
      )}
      
      {/* Step 3 would be the Column Mapping UI */}
    </div>
  );
}