import React from 'react';

export const SnowflakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="17" y1="5" x2="7" y2="15" />
    <line x1="7" y1="9" x2="17" y2="19" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="5" y1="17" x2="15" y2="7" />
    <line x1="19" y1="7" x2="9" y2="17" />
  </svg>
);
