import React, { useState } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function DirectoryForm({ onValidationStart }) {
  const [imagePath, setImagePath] = useState('');
  const [emberAppPath, setEmberAppPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imagePath || !emberAppPath) {
      toast.error('Both paths are required');
      return;
    }

    setIsLoading(true);
    onValidationStart?.();

    try {
      const response = await fetch('http://localhost:3001/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagePath, emberAppPath }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      toast.success('Validation completed successfully');
    } catch (error) {
      toast.error('Failed to validate directories');
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="imagePath" className="block text-sm font-medium text-gray-700">
            Images Directory
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FolderIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="imagePath"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="/path/to/images"
            />
          </div>
        </div>

        <div>
          <label htmlFor="emberAppPath" className="block text-sm font-medium text-gray-700">
            Ember App Directory
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FolderIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="emberAppPath"
              value={emberAppPath}
              onChange={(e) => setEmberAppPath(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="/path/to/ember-app"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Validating...' : 'Validate Directories'}
        </button>
      </div>
    </form>
  );
}

export default DirectoryForm;