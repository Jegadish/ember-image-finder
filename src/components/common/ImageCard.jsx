import React from 'react';
import CopyButton from './CopyButton';
import FileSize from './FileSize';

function ImageCard({ image, icon: Icon, iconColor, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <Icon className={`h-6 w-6 ${iconColor} mt-1`} />
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">{image.path}</h3>
              <CopyButton text={image.path} label="Copy path" />
            </div>
            <p className="text-sm text-gray-500">
              Size: <FileSize bytes={image.size} />
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;