import React from 'react';
import { JobPosting } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LocationIcon from './icons/LocationIcon';
import ClockIcon from './icons/ClockIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import SocialShare from './SocialShare';
import TelegramIcon from './icons/TelegramIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import SimilarJobCard from './SimilarJobCard';
import UserIcon from './icons/UserIcon';

interface JobDetailPageProps {
  job: JobPosting;
  onBack: () => void;
  allJobs: JobPosting[];
  onJobSelect: (job: JobPosting) => void;
}

const DetailListItem: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span>{children}</span>
    </li>
);

const JobDetailPage: React.FC<JobDetailPageProps> = ({ job, onBack, allJobs, onJobSelect }) => {
  const similarJobs = allJobs.filter(j => 
    j.id !== job.id && (j.company === job.company || j.category === job.category)
  ).slice(0, 3);

  return (
    <div className="relative">
      <SocialShare jobTitle={job.title} jobUrl={job.url} />
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-slate-200 animate-fade-in lg:ml-16">
        <button 
          onClick={onBack}
          className="flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to all jobs
        </button>
        
        <div className="flex items-start">
          <div className="w-20 h-20 p-2 border border-slate-200 rounded-lg flex-shrink-0 mr-6">
              <img src={job.companyLogoUrl} alt={`${job.company} Logo`} className="w-full h-full object-contain" />
          </div>
          <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{job.title}</h1>
              <p className="text-xl text-slate-600 mt-1">{job.company}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
                  <div className="flex items-center">
                      <LocationIcon className="w-4 h-4 mr-2" />
                      <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      <span>{job.experienceLevel}</span>
                  </div>
                   <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
              </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} 
          />
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                  href="https://t.me/your_telegram_group" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                  <TelegramIcon className="w-5 h-5 mr-2" />
                  Join on Telegram
              </a>
              <a
                  href="https://whatsapp.com/channel/0029Vb7FYBoIXnltwyBLfo3V" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                  <WhatsappIcon className="w-5 h-5 mr-2" />
                  Join on WhatsApp
              </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
          <ul className="space-y-2 text-slate-600">
              {job.requirements.map((req, index) => <DetailListItem key={index}>{req}</DetailListItem>)}
          </ul>
        </div>

         <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Qualifications</h2>
          <ul className="space-y-2 text-slate-600">
              {job.qualifications.map((qual, index) => <DetailListItem key={index}>{qual}</DetailListItem>)}
          </ul>
        </div>

        {similarJobs.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Similar Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarJobs.map(j => (
                        <SimilarJobCard key={j.id} job={j} onClick={() => onJobSelect(j)} />
                    ))}
                </div>
            </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Now
            </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;