import React from 'react';
import { JobPosting } from './types';
import EditIcon from './components/icons/EditIcon';
import TrashIcon from './components/icons/TrashIcon';
import PlusIcon from './components/icons/PlusIcon';
import LogoutIcon from './components/icons/LogoutIcon';
import SparklesIcon from './components/icons/SparklesIcon';

interface AdminPanelProps {
    jobs: JobPosting[];
    onEdit: (job: JobPosting) => void;
    onDelete: (jobId: number) => void;
    onAddNew: () => void;
    onLogout: () => void;
    onScoutJobs: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ jobs, onEdit, onDelete, onAddNew, onLogout, onScoutJobs }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manage Job Postings</h2>
                <div className="flex items-center gap-3 self-end sm:self-center flex-wrap justify-end">
                     <button
                        onClick={onScoutJobs}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Find Jobs with AI
                    </button>
                    <button
                        onClick={onAddNew}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add New Job
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Company</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Type</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Posted</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {job.title}
                                    <div className="font-normal text-slate-500 md:hidden">{job.company}</div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">{job.company}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{job.type}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{new Date(job.postedDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center space-x-3">
                                        <button onClick={() => onEdit(job)} className="text-blue-600 hover:text-blue-800" aria-label={`Edit ${job.title}`}>
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDelete(job.id)} className="text-red-600 hover:text-red-800" aria-label={`Delete ${job.title}`}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {jobs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No jobs to display. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;