import React from 'react';

export const TurkeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 12c0-5.523 4.477-10 10-10v10H12z" />
    <path d="M2 12h10" />
    <path d="M12 12c0 5.523 4.477 10 10 10v-10H12z" />
    <path d="M12 12c-5.523 0-10 4.477-10 10h10v-10z" />
    <path d="M12 12c-5.523 0-10-4.477-10-10h10v10z" />
    <path d="M12.63 11.25a.5.5 0 1 0-.63.75a.5.5 0 0 0 .63-.75" />
    <path d="M14 14c0 2-3 2-3 4" />
    <path d="M13 21H8" />
  </svg>
);
