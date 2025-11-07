import React from 'react';
import LocationIcon from './icons/LocationIcon';
import ClockIcon from './icons/ClockIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 flex flex-col h-full animate-pulse">
        <div className="p-6 flex-grow">
            <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-md flex-shrink-0 mr-4"></div>
                <div className="flex-grow">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center">
                    <div className="h-4 w-4 bg-slate-200 rounded-full mr-1.5"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                </div>
                 <div className="flex items-center">
                    <div className="h-4 w-4 bg-slate-200 rounded-full mr-1.5"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="flex items-center">
                    <div className="h-4 w-4 bg-slate-200 rounded-full mr-1.5"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                </div>
                 <div className="flex items-center">
                    <div className="h-4 w-4 bg-slate-200 rounded-full mr-1.5"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default JobCardSkeleton;