import React, { useState } from 'react';
import { FileSpreadsheet, Link, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleSheetsInputProps {
  onSubmit: (sheetId: string, worksheetName: string) => void;
  loading?: boolean;
}

export function GoogleSheetsInput({ onSubmit, loading = false }: GoogleSheetsInputProps) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [worksheetName, setWorksheetName] = useState('Sheet1');
  const [error, setError] = useState<string | null>(null);

  const extractSheetId = (url: string): string | null => {
    // Extract sheet ID from various Google Sheets URL formats
    const patterns = [
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /^([a-zA-Z0-9-_]+)$/  // Just the ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      setError('Invalid Google Sheets URL or ID. Please check and try again.');
      return;
    }
    
    if (!worksheetName.trim()) {
      setError('Worksheet name is required.');
      return;
    }
    
    onSubmit(sheetId, worksheetName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Google Sheets Integration</p>
            <p className="text-sm text-blue-700 mt-1">
              Make sure your Google Sheets is shared or accessible with the service account.
            </p>
          </div>
        </div>
      </div>

      {/* Sheet URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Sheets URL or ID
        </label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => {
              setSheetUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150 ${
              error ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'
            }`}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Paste the full URL or just the sheet ID
        </p>
      </div>

      {/* Worksheet Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worksheet Name
        </label>
        <input
          type="text"
          value={worksheetName}
          onChange={(e) => {
            setWorksheetName(e.target.value);
            setError(null);
          }}
          placeholder="Sheet1"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150"
        />
        <p className="mt-1 text-xs text-gray-500">
          The name of the specific worksheet tab to import
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Example */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Example Format:</h4>
        <code className="text-xs text-gray-600 break-all">
          https://docs.google.com/spreadsheets/d/1AbC2dEfGhIjKlMnOpQrStUvWxYz/edit
        </code>
        <p className="text-xs text-gray-500 mt-2">
          Or just use the ID: <code className="text-gray-600">1AbC2dEfGhIjKlMnOpQrStUvWxYz</code>
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !sheetUrl.trim()}
        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <FileSpreadsheet size={18} />
            Import from Google Sheets
          </>
        )}
      </button>
    </form>
  );
}