
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-primary ${sizeClasses[size]}`}
            ></div>
            {text && <p className="text-secondary animate-pulse">{text}</p>}
        </div>
    );
};

export default Spinner;
