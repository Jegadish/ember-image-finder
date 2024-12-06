import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

function Summary({ summary }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Summary</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Referenced</div>
            <div className="text-xl font-semibold text-gray-900">
              {summary.referencedCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Unreferenced</div>
            <div className="text-xl font-semibold text-gray-900">
              {summary.unreferencedCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Missing</div>
            <div className="text-xl font-semibold text-gray-900">
              {summary.missingCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Duplicates</div>
            <div className="text-xl font-semibold text-gray-900">
              {summary.duplicateCount}
            </div>
          </div>
        </div>

        {(summary.issues.hasUnreferencedImages || 
          summary.issues.hasMissingImages || 
          summary.issues.hasAmbiguousReferences) && (
          <div className="mt-6 bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Potential Issues
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {summary.issues.hasUnreferencedImages && (
                      <li>You have unreferenced images that might be unused</li>
                    )}
                    {summary.issues.hasMissingImages && (
                      <li>There are missing images referenced in your code</li>
                    )}
                    {summary.issues.hasAmbiguousReferences && (
                      <li>Some image references are ambiguous</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Summary;