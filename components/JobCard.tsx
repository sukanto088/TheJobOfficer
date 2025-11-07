import React from 'react';
import { JobPosting } from '../types';
import LocationIcon from './icons/LocationIcon';
import ClockIcon from './icons/ClockIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserIcon from './icons/UserIcon';

interface JobCardProps {
  job: JobPosting;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 cursor-pointer flex flex-col h-full"
    >
        <div className="p-6 flex-grow">
            <div className="flex items-start mb-4">
                <div className="w-12 h-12 p-1 border border-slate-200 rounded-md flex-shrink-0 mr-4">
                    <img src={job.companyLogoUrl} alt={`${job.company} Logo`} className="w-full h-full object-contain" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-600">{job.company}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
                </div>
            </div>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
              {job.description.split('. ')[0] + '.'}
            </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-lg text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center">
                    <LocationIcon className="w-4 h-4 mr-1.5" />
                    <span>{job.location}</span>
                </div>
                 <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 mr-1.5" />
                    <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1.5" />
                    <span>{job.experienceLevel}</span>
                </div>
                <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5" />
                    <span>{timeSince(job.postedDate)}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default JobCard;