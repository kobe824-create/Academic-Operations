import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FileListAdmin = ({ refreshKey }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const fetchFiles = async () => {
        try {
            const { data } = await api.get('/files');
            setFiles(data);
        } catch (err) {
            setError('Failed to fetch files.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [refreshKey]);

    const handleApproval = async (fileId, approved) => {
        try {
            await api.patch(`/admin/files/${fileId}/approve`, { approved });
            fetchFiles(); // Refresh the list after action
        } catch (err) {
            console.error('Failed to update file status.', err);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">School Files</h3>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {files.map(file => (
                            <tr key={file._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {file.source === 'internal' ? (
                                        <a href={`/files/view/${file._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                            {file.fileName}
                                        </a>
                                    ) : (
                                        <a href={`http://localhost:5000/uploads/${file.filePath}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                            {file.fileName}
                                        </a>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.uploadedBy?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {file.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {!file.approved && (
                                        <button onClick={() => handleApproval(file._id, true)} className="mr-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Approve</button>
                                    )}
                                    <button onClick={() => handleApproval(file._id, false)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FileListAdmin;