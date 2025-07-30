import React from 'react';
import { Download, FileJson, CheckCircle } from 'lucide-react';

interface DataExportCardProps {
  filename: string;
  itemCount: number;
  preview?: any[];
  onExport: () => void;
}

export function DataExportCard({ filename, itemCount, preview, onExport }: DataExportCardProps) {
  return (
    <div className="animate-in slide-in-from-bottom-3 duration-300">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Data Collection Complete</h3>
              <p className="text-sm text-gray-600">{itemCount} items collected and ready for export</p>
            </div>
          </div>
          <FileJson className="w-5 h-5 text-green-600" />
        </div>

        {/* Preview Section */}
        {preview && preview.length > 0 && (
          <div className="mb-4 p-3 bg-white/70 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {preview.slice(0, 3).map((item, index) => (
                <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                  {item.source && <span className="font-medium">{item.source}: </span>}
                  {item.type === 'crawl4ai_extraction' 
                    ? `Extracted ${item.content ? item.content.substring(0, 100) + '...' : 'content'}`
                    : JSON.stringify(item).substring(0, 100) + '...'
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          <span>Export as JSON ({filename})</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Click to download all collected data in JSON format
        </p>
      </div>
    </div>
  );
}