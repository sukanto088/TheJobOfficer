import React, { useState } from 'react';
import FacebookIcon from './icons/FacebookIcon';
import TelegramIcon from './icons/TelegramIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import LinkedinIcon from './icons/LinkedinIcon';
import LinkIcon from './icons/LinkIcon';

interface SocialShareProps {
    jobTitle: string;
    jobUrl: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ jobTitle, jobUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    const encodedUrl = encodeURIComponent(jobUrl);
    const encodedTitle = encodeURIComponent(jobTitle);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(jobUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const iconStyle = "w-6 h-6";

    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-4 z-30 hidden lg:block">
            <div className="flex flex-col items-center gap-2 p-2 bg-white rounded-full shadow-lg border border-slate-200">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors" aria-label="Share on Facebook">
                    <FacebookIcon className={iconStyle} />
                </a>
                 <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-slate-600 hover:bg-sky-100 hover:text-sky-600 transition-colors" aria-label="Share on Telegram">
                    <TelegramIcon className={iconStyle} />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors" aria-label="Share on WhatsApp">
                    <WhatsappIcon className={iconStyle} />
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors" aria-label="Share on LinkedIn">
                    <LinkedinIcon className={iconStyle} />
                </a>
                <div className="w-full px-2">
                    <div className="h-px bg-slate-200"></div>
                </div>
                <button onClick={handleCopyLink} className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="Copy Link">
                    <LinkIcon className={iconStyle} />
                    {isCopied && (
                        <span className="absolute left-full ml-3 px-2 py-1 text-xs text-white bg-gray-800 rounded-md whitespace-nowrap">
                            Copied!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SocialShare;