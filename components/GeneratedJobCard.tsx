import React from 'react';
import { JobPosting } from '../types';
import LocationIcon from './icons/LocationIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PlusIcon from './icons/PlusIcon';
import CheckIcon from './icons/CheckIcon';

type GeneratedJob = Omit<JobPosting, 'id' | 'postedDate' | 'companyLogoUrl'>;

interface GeneratedJobCardProps {
  job: GeneratedJob;
  onAdd: () => void;
  isAdded: boolean;
}

const GeneratedJobCard: React.FC<GeneratedJobCardProps> = ({ job, onAdd, isAdded }) => {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h4 className="font-bold text-gray-900">{job.title}</h4>
            <p className="text-sm text-slate-700">{job.company}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center"><LocationIcon className="w-3 h-3 mr-1" />{job.location}</span>
                <span className="flex items-center"><BriefcaseIcon className="w-3 h-3 mr-1" />{job.type}</span>
            </div>
        </div>
        <button
            onClick={onAdd}
            disabled={isAdded}
            className={`flex-shrink-0 flex items-center px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                isAdded
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
        >
            {isAdded ? <CheckIcon className="w-4 h-4 mr-1" /> : <PlusIcon className="w-4 h-4 mr-1" />}
            {isAdded ? 'Added' : 'Add to Board'}
        </button>
    </div>
  );
};

export default GeneratedJobCard;
