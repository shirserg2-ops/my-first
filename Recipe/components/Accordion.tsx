import React, { ReactNode } from 'react';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  const contentId = React.useId();
  const titleId = React.useId();

  return (
    <div className="border-b border-slate-700">
      <h2>
        <button
          onClick={onClick}
          className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          aria-expanded={isOpen}
          aria-controls={contentId}
          id={titleId}
        >
          <span className="flex-1">{title}</span>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </h2>
      <div
        id={contentId}
        role="region"
        aria-labelledby={titleId}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="p-4 bg-slate-900/50 rounded-b-lg">
          {children}
        </div>
      </div>
    </div>
  );
};