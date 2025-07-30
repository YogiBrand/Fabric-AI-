import React from 'react';
import { StepRecord } from '../types';

interface StepLogTableProps {
  steps: StepRecord[];
  className?: string;
}

export function StepLogTable({ steps, className = '' }: StepLogTableProps) {
  return (
    <div className={`overflow-hidden rounded-lg shadow ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Screenshot
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {steps.map((step) => (
            <tr key={step.index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {step.index}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {step.action.toUpperCase()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {step.args.text && <span className="block">Text: "{step.args.text}"</span>}
                {step.args.selector && <span className="block">Selector: {step.args.selector}</span>}
                {step.args.url && <span className="block">URL: {step.args.url}</span>}
                {!step.args.text && !step.args.selector && !step.args.url && (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                {step.status === 'ok' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ OK
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ❌ Error
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {step.duration_ms}ms
              </td>
              <td className="px-4 py-3 text-sm">
                {step.screenshot_b64 ? (
                  <button
                    onClick={() => {
                      // Open screenshot in new window
                      const win = window.open();
                      if (win) {
                        win.document.write(`<img src="data:image/png;base64,${step.screenshot_b64}" />`);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {steps.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No steps recorded yet
        </div>
      )}
    </div>
  );
}