import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding, ...props }) => {
    return (
        <div className={`card ${noPadding ? 'p-0' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
};
