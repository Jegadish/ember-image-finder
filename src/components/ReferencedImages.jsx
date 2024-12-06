import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import ImageCard from './common/ImageCard';
import CopyButton from './common/CopyButton';

function ReferencedImages({ images }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Referenced Images</h2>
      
      <div className="grid gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.path}
            image={image}
            icon={CheckCircleIcon}
            iconColor="text-green-500"
          >
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700">Referenced in:</h4>
              {image.references.map((ref) => (
                <div key={ref.file} className="ml-4 mt-1 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {ref.file} (lines: {ref.lines.join(', ')})
                  </p>
                  <CopyButton text={ref.file} label="Copy file path" />
                </div>
              ))}
            </div>
          </ImageCard>
        ))}
      </div>
    </section>
  );
}

export default ReferencedImages;