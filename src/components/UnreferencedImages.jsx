import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ImageCard from './common/ImageCard';
import DateDisplay from './common/DateDisplay';

function UnreferencedImages({ images }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Unreferenced Images</h2>
      
      <div className="grid gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.path}
            image={image}
            icon={ExclamationCircleIcon}
            iconColor="text-yellow-500"
          >
            <DateDisplay date={image.modified} label="Last modified" />
          </ImageCard>
        ))}
      </div>
    </section>
  );
}

export default UnreferencedImages;