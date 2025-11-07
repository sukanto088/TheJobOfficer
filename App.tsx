import React, { useState, useEffect } from 'react';
import { JobPosting } from './types';
import Header from './components/Header';
import JobList from './components/JobList';
import JobDetailPage from './components/JobDetailPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminPanel from './components/AdminPanel';
import AddJobForm from './components/AddJobForm';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import JobListSkeleton from './components/JobListSkeleton';
import AIJobScout from './components/AIJobScout';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [jobToEdit, setJobToEdit] = useState<JobPosting | null>(null);
    const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
    
    const [locationHash, setLocationHash] = useState(window.location.hash);
    const [adminView, setAdminView] = useState<'panel' | 'form' | 'scout'>('panel');

    const fetchJobs = async () => {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('postedDate', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
        } else if (data) {
            setJobs(data as JobPosting[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchJobs();
    }, []);
    
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsBackToTopVisible(true);
            } else {
                setIsBackToTopVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setLocationHash(window.location.hash);
            window.scrollTo(0, 0);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    const handleJobSelect = (job: JobPosting) => {
        window.location.hash = `#/job/${job.id}`;
    };

    const handleBack = () => {
        window.location.hash = '#';
    };
    
    const handleLogin = async (email: string, password: string): Promise<string | null> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return error.message;
        }
        return null;
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setAdminView('panel');
        window.location.hash = '#';
    };
    
    const handleCancelForm = () => {
        setAdminView('panel');
        setJobToEdit(null);
    };

    const handleAddNewJob = () => {
        setJobToEdit(null);
        setAdminView('form');
    };

    const handleScoutJobs = () => {
        setAdminView('scout');
    };

    const handleEditJob = (job: JobPosting) => {
        setJobToEdit(job);
        setAdminView('form');
    };
    
    const handleSaveJob = async (jobData: Omit<JobPosting, 'id' | 'postedDate' | 'companyLogoUrl'> & { id?: number }) => {
        const companyName = jobData.company.toLowerCase().replace(/[^a-z0-9]/g, '');
        const companyLogoUrl = `https://logo.clearbit.com/${companyName}.com`;

        if (jobData.id) { // Editing existing job
            const { id, ...updateData } = { ...jobData, companyLogoUrl };
            const { error } = await supabase.from('jobs').update(updateData).eq('id', id);
             if (error) console.error("Error updating job:", error);
        } else { // Adding new job
            const { id, ...insertData } = { ...jobData, companyLogoUrl };
            const { error } = await supabase.from('jobs').insert([insertData]);
             if (error) console.error("Error creating job:", error);
        }
        
        await fetchJobs(); // Refresh job list
        setAdminView('panel');
        setJobToEdit(null);
    };

    const handleBulkAddJobs = async (newJobs: Omit<JobPosting, 'id' | 'postedDate' | 'companyLogoUrl'>[]) => {
        const formattedNewJobs = newJobs.map(job => {
            const companyName = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
            return {
                ...job,
                companyLogoUrl: `https://logo.clearbit.com/${companyName}.com`,
                url: job.url || '#'
            }
        });

        const { error } = await supabase.from('jobs').insert(formattedNewJobs);
        if (error) {
            console.error('Error bulk adding jobs:', error);
        } else {
            await fetchJobs();
        }
    };
    
    const handleDeleteJob = async (jobId: number) => {
        if(window.confirm('Are you sure you want to delete this job posting?')) {
            const { error } = await supabase.from('jobs').delete().eq('id', jobId);
            if (error) {
                console.error('Error deleting job:', error);
            } else {
                setJobs(jobs.filter(j => j.id !== jobId)); // Optimistic update
            }
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <JobListSkeleton />;

        if (locationHash.startsWith('#/job/')) {
            const jobId = parseInt(locationHash.substring(6), 10);
            const selectedJob = jobs.find(j => j.id === jobId);
            if (selectedJob) {
                return <JobDetailPage job={selectedJob} onBack={handleBack} allJobs={jobs} onJobSelect={handleJobSelect}/>;
            }
        }
        
        if (locationHash === '#/admin') {
            if (!session) {
                return <AdminLoginPage onLogin={handleLogin} onCancel={() => window.location.hash = '#'} />;
            }

            if (adminView === 'form') {
                 return <AddJobForm onSave={handleSaveJob} onCancel={handleCancelForm} jobToEdit={jobToEdit} />;
            }

            if (adminView === 'scout') {
                return <AIJobScout onCancel={handleCancelForm} onSave={handleBulkAddJobs} />;
            }
            
            return <AdminPanel jobs={jobs} onEdit={handleEditJob} onDelete={handleDeleteJob} onAddNew={handleAddNewJob} onLogout={handleLogout} onScoutJobs={handleScoutJobs}/>;
        }

        return <JobList jobs={jobs} onJobSelect={handleJobSelect} />;
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {renderContent()}
            </main>
            <Footer />
            <BackToTopButton isVisible={isBackToTopVisible} onClick={scrollToTop} />
        </div>
    );
};

export default App;