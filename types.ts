export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  category: 'Tech' | 'Non-Tech';
  experienceLevel: 'Fresher' | 'Experienced';
  description: string;
  postedDate: string;
  url: string;
  companyLogoUrl: string;
  requirements: string[];
  qualifications: string[];
}