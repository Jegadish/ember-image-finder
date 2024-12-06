import React from 'react';
import { ChartBarIcon, PhotoIcon, DocumentIcon, LinkIcon } from '@heroicons/react/24/outline';
import FileSize from './common/FileSize';

function StatCard({ icon: Icon, title, value, subtitle = null }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-indigo-500" />
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ImageTypeDistribution({ imageTypes }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Image Types Distribution</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(imageTypes).map(([type, count]) => (
          <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-500">{type}</div>
            <div className="text-xl font-semibold text-gray-900">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Statistics({ statistics }) {
  const totalSize = Object.entries(statistics.imageTypes).reduce((acc, [_, count]) => acc + count, 0);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={PhotoIcon}
          title="Total Images"
          value={statistics.totalImages}
          subtitle={<FileSize bytes={totalSize} />}
        />
        <StatCard
          icon={DocumentIcon}
          title="Ember Files"
          value={statistics.totalEmberFiles}
        />
        <StatCard
          icon={LinkIcon}
          title="References"
          value={statistics.totalReferences}
        />
        <StatCard
          icon={ChartBarIcon}
          title="Image Types"
          value={Object.keys(statistics.imageTypes).length}
        />
      </div>

      <ImageTypeDistribution imageTypes={statistics.imageTypes} />
    </section>
  );
}

export default Statistics;