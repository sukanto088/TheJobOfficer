import React, { useState, useEffect } from 'react';
import { JobPosting } from '../types';
// Fix: Importing GoogleGenAI and GenerateContentResponse to use the Gemini API.
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import SpinnerIcon from './icons/SpinnerIcon';

interface AddJobFormProps {
    onSave: (job: Omit<JobPosting, 'id' | 'postedDate' | 'companyLogoUrl'> & { id?: number }) => void;
    onCancel: () => void;
    jobToEdit: JobPosting | null;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onSave, onCancel, jobToEdit }) => {
    const [job, setJob] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time' as JobPosting['type'],
        category: 'Tech' as JobPosting['category'],
        experienceLevel: 'Experienced' as JobPosting['experienceLevel'],
        url: '',
        description: '',
        requirements: '',
        qualifications: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (jobToEdit) {
            setJob({
                title: jobToEdit.title,
                company: jobToEdit.company,
                location: jobToEdit.location,
                type: jobToEdit.type,
                category: jobToEdit.category,
                experienceLevel: jobToEdit.experienceLevel,
                url: jobToEdit.url,
                description: jobToEdit.description,
                requirements: jobToEdit.requirements.join('\n'),
                qualifications: jobToEdit.qualifications.join('\n'),
            });
        }
    }, [jobToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setJob(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!job.title || !job.company || !job.location) {
            setError('Please fill in all required fields.');
            return;
        }
        setError('');
        const jobData = {
            ...job,
            requirements: job.requirements.split('\n').filter(r => r.trim() !== ''),
            qualifications: job.qualifications.split('\n').filter(q => q.trim() !== ''),
        };
        onSave(jobToEdit ? { ...jobData, id: jobToEdit.id } : jobData);
    };

    const handleGenerateDescription = async () => {
        if (!job.title) {
            alert('Please enter a job title first.');
            return;
        }
        setIsGenerating(true);
        setError('');
        try {
            // Fix: According to the guidelines, the API key must be obtained exclusively from process.env.API_KEY
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write a compelling job description for a "${job.title}" position. Include a main description, a list of key requirements, and a list of desired qualifications. Also, classify the job category as either "Tech" or "Non-Tech", and the experience level as "Fresher" or "Experienced". Format the output as a JSON object with five keys: "description", "requirements" (an array of strings), "qualifications" (an array of strings), "category" (a string: "Tech" or "Non-Tech"), and "experienceLevel" (a string: "Fresher" or "Experienced").`;

            // Fix: According to the guidelines, use ai.models.generateContent
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash', // Basic text task model
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            requirements: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING } 
                            },
                            qualifications: { 
                                type: Type.ARRAY, 
                                items: { type: Type.STRING } 
                            },
                            category: { type: Type.STRING },
                            experienceLevel: { type: Type.STRING },
                        }
                    }
                }
            });
            
            // Fix: According to the guidelines, use response.text to get the text output
            const text = response.text;
            const generatedContent = JSON.parse(text);

            if (generatedContent.description && generatedContent.requirements && generatedContent.qualifications && generatedContent.category && generatedContent.experienceLevel) {
                setJob(prev => ({
                    ...prev,
                    description: generatedContent.description,
                    requirements: generatedContent.requirements.join('\n'),
                    qualifications: generatedContent.qualifications.join('\n'),
                    category: generatedContent.category === 'Non-Tech' ? 'Non-Tech' : 'Tech', // Ensure valid category
                    experienceLevel: generatedContent.experienceLevel === 'Fresher' ? 'Fresher' : 'Experienced', // Ensure valid experience level
                }));
            } else {
                setError("AI generated content was in an unexpected format.");
            }

        } catch (e) {
            console.error("Error generating job description:", e);
            if (e instanceof Error && e.message.toLowerCase().includes('api key')) {
                setError("AI features are disabled. The Google AI API key is missing or invalid in the application's environment.");
            } else {
                setError("Failed to generate description. The AI might be busy. Please try again.");
            }
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-slate-200 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{jobToEdit ? 'Edit Job' : 'Add New Job'}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <fieldset disabled={isGenerating} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Job Title *</label>
                            <input type="text" name="title" id="title" value={job.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50" />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company *</label>
                            <input type="text" name="company" id="company" value={job.company} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location *</label>
                            <input type="text" name="location" id="location" value={job.location} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-slate-700">Job Type</label>
                                <select name="type" id="type" value={job.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                                <select name="category" id="category" value={job.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50">
                                    <option>Tech</option>
                                    <option>Non-Tech</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="experienceLevel" className="block text-sm font-medium text-slate-700">Experience</label>
                                <select name="experienceLevel" id="experienceLevel" value={job.experienceLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50">
                                    <option>Experienced</option>
                                    <option>Fresher</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-slate-700">Application URL</label>
                        <input type="url" name="url" id="url" value={job.url} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Job Description</label>
                            <button 
                                type="button" 
                                onClick={handleGenerateDescription}
                                disabled={isGenerating}
                                className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : '✨ Generate with AI'}
                            </button>
                        </div>
                        <textarea name="description" id="description" rows={6} value={job.description} onChange={handleChange} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50"></textarea>
                    </div>
                    <div>
                        <label htmlFor="requirements" className="block text-sm font-medium text-slate-700">Requirements (one per line)</label>
                        <textarea name="requirements" id="requirements" rows={4} value={job.requirements} onChange={handleChange} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50"></textarea>
                    </div>
                    <div>
                        <label htmlFor="qualifications" className="block text-sm font-medium text-slate-700">Qualifications (one per line)</label>
                        <textarea name="qualifications" id="qualifications" rows={4} value={job.qualifications} onChange={handleChange} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50"></textarea>
                    </div>
                </fieldset>
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={isGenerating} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">{jobToEdit ? 'Save Changes' : 'Add Job'}</button>
                </div>
            </form>
        </div>
    );
};

export default AddJobForm;