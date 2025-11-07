import React from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon';

interface BackToTopButtonProps {
    isVisible: boolean;
    onClick: () => void;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ isVisible, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Back to top"
        >
            <ArrowUpIcon className="w-6 h-6" />
        </button>
    );
};

export default BackToTopButton;