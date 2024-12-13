import React from 'react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ onChange, ...props }) => {
    return (
        <input
            type="file"
            onChange={onChange}
            {...props}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
    );
};
