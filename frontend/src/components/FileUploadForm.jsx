import React, { useState } from 'react';
import api from '../services/api';

const FileUploadForm = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess('File uploaded successfully!');
            setFile(null);
            e.target.reset();
            if (onFileUploaded) onFileUploaded();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload file.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Upload File
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    {file && <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>}
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                {success && <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">{success}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
        </div>
    );
};

export default FileUploadForm;