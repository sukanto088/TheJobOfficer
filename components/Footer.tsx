import React from 'react';
import LinkedinIcon from './icons/LinkedinIcon';
import FacebookIcon from './icons/FacebookIcon';
import TelegramIcon from './icons/TelegramIcon';
import WhatsappIcon from './icons/WhatsappIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-slate-400">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} TheJobofficer. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Telegram">
              <TelegramIcon className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
              <WhatsappIcon className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;