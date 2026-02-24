import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
    FileText,
    Download,
    ChevronLeft,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    Eye,
    FileIcon,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileViewerPage = () => {
    const { fileId } = useParams();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewUrl, setViewUrl] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const { data } = await api.get(`/files/${fileId}`);
                setFile(data);

                // For external files, fetch the actual file content as a blob for secure viewing
                if (data.source !== 'internal') {
                    const response = await api.get(`/files/view/${fileId}`, { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([response.data], { type: data.fileType }));
                    setViewUrl(url);
                }
            } catch (err) {
                setError('The requested document could not be retrieved from the archive.');
            } finally {
                setLoading(false);
            }
        };
        fetchFile();

        return () => {
            if (viewUrl) window.URL.revokeObjectURL(viewUrl);
        };
    }, [fileId]);

    const basePath = user?.role === 'admin' ? '/admin' : '/teacher';

    const handleDownload = async () => {
        try {
            const response = await api.get(`/files/download/${fileId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // If the response is CSV (internal marks), ensure extension is .csv
            let downloadName = file.fileName;
            if (file.source === 'internal' && file.fileType === 'marks' && !downloadName.toLowerCase().endsWith('.csv')) {
                downloadName += '.csv';
            }

            link.setAttribute('download', downloadName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download protocol failed');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse text-slate-400">
                <Clock className="mb-4" size={40} />
                <p className="font-semibold uppercase tracking-widest text-xs">Accessing Archive...</p>
            </div>
        );
    }

    if (error || !file) {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Access Error</h2>
                <p className="text-sm text-slate-500 mb-8">{error || 'Resource not found.'}</p>
                <Link to={`${basePath}/files`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all">
                    <ChevronLeft size={18} /> Return to Repository
                </Link>
            </div>
        );
    }

    const renderUploadedFile = () => {
        const ext = file.fileName?.split('.').pop()?.toLowerCase() || '';
        const mime = file.fileType || '';

        if (ext === 'pdf' || mime === 'application/pdf') {
            return (
                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner" style={{ height: '80vh' }}>
                    <iframe src={viewUrl} className="w-full h-full border-0" title={file.fileName} />
                </div>
            );
        }

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) || mime.startsWith('image/')) {
            return (
                <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200 shadow-inner">
                    <img src={viewUrl} alt={file.fileName} className="max-w-full h-auto mx-auto rounded-2xl shadow-lg shadow-slate-900/10" />
                </div>
            );
        }

        return (
            <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-200">
                <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <FileIcon className="text-slate-400" size={36} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Native Preview Unavailable</h3>
                <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto font-medium">This file format requires local processing. Please download to view.</p>
                <button onClick={handleDownload} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                    <Download size={18} /> Initiate Download
                </button>
            </div>
        );
    };

    const renderInternalFile = () => {
        const content = file.content;

        if (file.fileType === 'marks' && content?.students) {
            return (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Academic Marks Record</h3>
                            <p className="text-xs text-slate-500 font-medium">Target Marks: <span className="text-blue-600 font-black">{content.targetMarks || 100}</span></p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {content.students.map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={`text-lg font-black ${parseFloat(s.marks) >= (content.targetMarks || 100) * 0.5 ? 'text-blue-600' : 'text-red-500'}`}>
                                                {s.marks || '0'}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 ml-1">/ {content.targetMarks || 100}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-slate-300 font-mono text-sm leading-relaxed border border-slate-800 shadow-2xl">
                <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <Link to={`${basePath}/files`} className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-4">
                        <ChevronLeft size={16} /> Repository Index
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{file.fileName}</h1>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${file.approved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {file.approved ? 'Audit Passed' : 'Pending Review'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDownload} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> Save Copy
                    </button>
                    {file.source === 'internal' && file.fileType === 'marks' && (
                        <Link
                            to={`${basePath}/create-file?edit=${file._id}`}
                            className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                            Edit Marks
                        </Link>
                    )}
                    {file.source !== 'internal' && (
                        <button onClick={() => window.open(viewUrl, '_blank')} className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                            <Eye size={18} /> Full Window
                        </button>
                    )}
                </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><User size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archivist</p>
                        <p className="text-sm font-bold text-slate-900">{file.uploadedBy?.name || 'System'}</p>
                    </div>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Clock size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(file.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><FileText size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source Protocol</p>
                        <p className="text-sm font-bold text-slate-900 uppercase">{file.source === 'internal' ? 'Internal System' : 'External Asset'}</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 backdrop-blur-md"
            >
                {file.source === 'upload' ? renderUploadedFile() : renderInternalFile()}
            </motion.div>
        </div>
    );
};

/* Small helper component to fetch and display text files */
const TextFileViewer = ({ url }) => {
    const [text, setText] = useState('Loading...');
    useEffect(() => {
        fetch(url)
            .then(r => r.text())
            .then(setText)
            .catch(() => setText('Failed to load file content.'));
    }, [url]);
    return (
        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono p-4 bg-gray-50 rounded-lg max-h-[70vh] overflow-auto">
            {text}
        </pre>
    );
};

export default FileViewerPage;
