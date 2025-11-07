import React from 'react';
import JobCardSkeleton from './JobCardSkeleton';

const JobListSkeleton: React.FC = () => {
  return (
    <div className="lg:ml-16">
      <div className="space-y-8">
        <div className="flex flex-col gap-6 items-center">
          {/* Placeholder for filters */}
          <div className="h-10 bg-slate-200 rounded-full w-48 animate-pulse"></div>
          {/* Placeholder for search bar */}
          <div className="w-full max-w-xl h-12 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobListSkeleton;