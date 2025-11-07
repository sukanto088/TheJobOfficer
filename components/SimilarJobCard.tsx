import React from 'react';
import { JobPosting } from '../types';
import LocationIcon from './icons/LocationIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserIcon from './icons/UserIcon';

interface SimilarJobCardProps {
  job: JobPosting;
  onClick: () => void;
}

const SimilarJobCard: React.FC<SimilarJobCardProps> = ({ job, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 cursor-pointer flex flex-col h-full p-4"
    >
        <div className="flex items-start mb-3">
            <div className="w-10 h-10 p-1 border border-slate-200 rounded-md flex-shrink-0 mr-3">
                <img src={job.companyLogoUrl} alt={`${job.company} Logo`} className="w-full h-full object-contain" />
            </div>
            <div>
                <p className="text-xs font-semibold text-blue-600">{job.company}</p>
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{job.title}</h3>
            </div>
        </div>
        <div className="mt-auto pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex items-center">
                <LocationIcon className="w-3 h-3 mr-1.5" />
                <span>{job.location}</span>
            </div>
             <div className="flex items-center">
                <BriefcaseIcon className="w-3 h-3 mr-1.5" />
                <span>{job.type}</span>
            </div>
            <div className="flex items-center">
                <UserIcon className="w-3 h-3 mr-1.5" />
                <span>{job.experienceLevel}</span>
            </div>
        </div>
    </div>
  );
};

export default SimilarJobCard;