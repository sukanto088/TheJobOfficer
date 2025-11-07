import React, { useState, useMemo } from 'react';
import { JobPosting } from '../types';
import JobCard from './JobCard';
import Pagination from './Pagination';

interface JobListProps {
  jobs: JobPosting[];
  onJobSelect: (job: JobPosting) => void;
}

const JOBS_PER_PAGE = 9;

const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tech' | 'Non-Tech'>('All');
  const [experienceFilter, setExperienceFilter] = useState<'All' | 'Fresher' | 'Experienced'>('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [isInternshipOnly, setIsInternshipOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => activeFilter === 'All' || job.category === activeFilter)
      .filter(job => experienceFilter === 'All' || job.experienceLevel === experienceFilter)
      .filter(job => !isRemoteOnly || job.location.toLowerCase() === 'remote')
      .filter(job => !isInternshipOnly || job.type === 'Internship')
      .filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [jobs, searchTerm, activeFilter, experienceFilter, isRemoteOnly, isInternshipOnly]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const handleFilterChange = (filter: 'All' | 'Tech' | 'Non-Tech') => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleExperienceFilterChange = (filter: 'All' | 'Fresher' | 'Experienced') => {
    setExperienceFilter(filter);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const FilterButton: React.FC<{
    label: string,
    active: boolean,
    onClick: () => void
  }> = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow'
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );

  const ToggleSwitch: React.FC<{
    label: string;
    id: string;
    isChecked: boolean;
    onChange: () => void;
  }> = ({ label, id, isChecked, onChange }) => (
     <div className="flex items-center space-x-2 p-1 pl-3 bg-slate-200 rounded-full">
        <label htmlFor={id} className="text-sm font-semibold text-slate-600 cursor-pointer pr-1">
            {label}
        </label>
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={onChange}
            id={id}
            className={`${
                isChecked ? 'bg-blue-600' : 'bg-slate-300'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
        >
            <span
                className={`${
                    isChecked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
  );

  return (
    <div>
        <div className="space-y-8">
            <div className="flex flex-col gap-6 items-center">
                 <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4">
                    <div className="flex items-center space-x-2 p-1 bg-slate-200 rounded-full">
                        <FilterButton label="All" active={activeFilter === 'All'} onClick={() => handleFilterChange('All')} />
                        <FilterButton label="Tech" active={activeFilter === 'Tech'} onClick={() => handleFilterChange('Tech')} />
                        <FilterButton label="Non-Tech" active={activeFilter === 'Non-Tech'} onClick={() => handleFilterChange('Non-Tech')} />
                    </div>
                    <div className="flex items-center space-x-2 p-1 bg-slate-200 rounded-full">
                        <FilterButton label="All Levels" active={experienceFilter === 'All'} onClick={() => handleExperienceFilterChange('All')} />
                        <FilterButton label="Fresher" active={experienceFilter === 'Fresher'} onClick={() => handleExperienceFilterChange('Fresher')} />
                        <FilterButton label="Experienced" active={experienceFilter === 'Experienced'} onClick={() => handleExperienceFilterChange('Experienced')} />
                    </div>
                    <ToggleSwitch 
                        label="Work from Home"
                        id="wfh-toggle"
                        isChecked={isRemoteOnly}
                        onChange={() => {
                            setIsRemoteOnly(prev => !prev);
                            setCurrentPage(1);
                        }}
                    />
                     <ToggleSwitch 
                        label="Internships"
                        id="internship-toggle"
                        isChecked={isInternshipOnly}
                        onChange={() => {
                            setIsInternshipOnly(prev => !prev);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search by title, company, or location..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-5 py-3 text-base text-gray-700 placeholder-gray-500 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
           
            {paginatedJobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedJobs.map(job => (
                            <JobCard key={job.id} job={job} onClick={() => onJobSelect(job)} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-800">No jobs found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default JobList;