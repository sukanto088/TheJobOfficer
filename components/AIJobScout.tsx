import React, { useState } from 'react';
import { JobPosting } from '../types';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import SpinnerIcon from './icons/SpinnerIcon';
import SparklesIcon from './icons/SparklesIcon';
import GeneratedJobCard from './GeneratedJobCard';

type GeneratedJob = Omit<JobPosting, 'id' | 'postedDate' | 'companyLogoUrl'>;

interface AIJobScoutProps {
    onSave: (jobs: GeneratedJob[]) => void;
    onCancel: () => void;
}

const exampleQueries = [
    "Latest marketing jobs in Bangalore for experienced professionals",
    "Entry-level data analyst roles in India (remote)",
    "Part-time content writing internships",
];

const extractJsonFromMarkdown = (markdown: string): string | null => {
    // Look for a JSON code block
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = markdown.match(jsonBlockRegex);
    if (match && match[1]) {
        return match[1];
    }
    
    // Fallback for raw JSON string that starts with [ and ends with ]
    const trimmed = markdown.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
            JSON.parse(trimmed);
            return trimmed; // It's valid JSON
        } catch (e) {
            // Not valid JSON, fall through
        }
    }

    return null;
};


const AIJobScout: React.FC<AIJobScoutProps> = ({ onSave, onCancel }) => {
    const [query, setQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generatedJobs, setGeneratedJobs] = useState<GeneratedJob[]>([]);
    const [addedJobs, setAddedJobs] = useState<Set<string>>(new Set());

    const handleGenerateJobs = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) {
            setError('Please enter a query to find jobs.');
            return;
        }
        setIsGenerating(true);
        setError('');
        setGeneratedJobs([]);
        setAddedJobs(new Set());

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are a professional job recruiter for an Indian job board called "TheJobofficer".
Your task is to generate a list of 5 realistic, recent job postings suitable for Indian job seekers based on the user's query.
The location for each job should be relevant to India if not specified in the query.

User Query: "${query}"

Your response MUST be a single JSON array of objects, enclosed in a markdown code block (\`\`\`json ... \`\`\`).
Do NOT include any text, explanation, or conversation before or after the JSON code block.
Each object in the JSON array must have the following keys: "title", "company", "location", "type", "category", "experienceLevel", "description", "url", "requirements", and "qualifications".
- "type" must be one of: 'Full-time', 'Part-time', 'Contract', 'Internship'
- "category" must be one of: 'Tech', 'Non-Tech'
- "experienceLevel" must be one of: 'Fresher', 'Experienced'
- "requirements" and "qualifications" must be an array of strings.
- "url" should be a placeholder "#".`;
            
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            const jsonString = extractJsonFromMarkdown(text);
            
            if (jsonString) {
                const parsedJobs = JSON.parse(jsonString);
                setGeneratedJobs(parsedJobs);
            } else {
                console.error("Failed to extract JSON from response:", text);
                throw new Error("Could not find valid JSON in the AI's response.");
            }
           
        } catch (e) {
            console.error("Error generating jobs:", e);
            if (e instanceof Error && e.message.toLowerCase().includes('api key')) {
                setError("AI features are disabled. The Google AI API key is missing or invalid in the application's environment.");
            } else {
                setError("Failed to generate jobs. The AI might be busy or the query is too complex. Please try again with a more specific query.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddJob = (jobToAdd: GeneratedJob) => {
        onSave([jobToAdd]);
        // Use a unique identifier for the job to track if it's been added
        const jobIdentifier = `${jobToAdd.title}-${jobToAdd.company}`;
        setAddedJobs(prev => new Set(prev).add(jobIdentifier));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-slate-200 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Job Scout</h2>
            <p className="text-slate-600 mb-6">Describe the kind of jobs you're looking for, and our AI will generate relevant postings.</p>

            <form onSubmit={handleGenerateJobs} className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Latest remote developer jobs for freshers'"
                    className="w-full px-4 py-2 text-base text-gray-700 placeholder-gray-500 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-50"
                    disabled={isGenerating}
                />
                <button
                    type="submit"
                    disabled={isGenerating || !query}
                    className="w-full sm:w-auto flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
                >
                    {isGenerating ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    <span>{isGenerating ? 'Scouting...' : 'Find Jobs'}</span>
                </button>
            </form>
            
            <div className="text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded-md">
                <p className="font-semibold mb-2">Pro Tip: Be specific for better results!</p>
                <p>Try one of these examples:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {exampleQueries.map(ex => (
                        <button 
                          key={ex}
                          onClick={() => setQuery(ex)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-xs"
                        >
                            "{ex}"
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            {isGenerating && (
                <div className="text-center py-10">
                    <SpinnerIcon className="w-8 h-8 mx-auto animate-spin text-purple-600" />
                    <p className="mt-4 text-slate-600">AI is scouting for the best jobs...</p>
                </div>
            )}
            
            {generatedJobs.length > 0 && (
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Generated Jobs</h3>
                    {generatedJobs.map((job, index) => {
                        const jobIdentifier = `${job.title}-${job.company}`;
                        return (
                            <GeneratedJobCard 
                                key={index} 
                                job={job} 
                                onAdd={() => handleAddJob(job)}
                                isAdded={addedJobs.has(jobIdentifier)}
                            />
                        )
                    })}
                </div>
            )}


            <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">Back to Panel</button>
            </div>
        </div>
    );
};

export default AIJobScout;