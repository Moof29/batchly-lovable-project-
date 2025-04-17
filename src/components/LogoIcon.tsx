
import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {}

export const LogoIcon: React.FC<LogoIconProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className={className}
      {...props}
    >
      <circle cx="256" cy="256" r="256" fill="#2ecc71" />
      <path 
        d="M256 128c-70.692 0-128 57.308-128 128s57.308 128 128 128 128-57.308 128-128-57.308-128-128-128zm64 160h-64a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h64a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32z" 
        fill="white"
      />
    </svg>
  );
};
