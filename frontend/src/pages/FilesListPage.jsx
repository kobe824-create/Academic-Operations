import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
    FileText,
    Trash2,
    Download,
    Eye,
    Search,
    Plus,
    Upload,
    UploadCloud,
    Users,
    MoreVertical,
    AlertCircle,
    CheckCircle2,
    Clock,
    X,
    FileIcon,
    DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilesListPage = () => {
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [allClasses, setAllClasses] = useState([]);
    const [uploadClassId, setUploadClassId] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';
    const basePath = isAdmin ? '/admin' : '/teacher';

    const fetchFiles = useCallback(async () => {
        try {
            const { data } = await api.get('/files');
            setFiles(data);
        } catch (err) {
            setError('Failed to sync with repository.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClasses = useCallback(async () => {
        try {
            const { data } = await api.get('/classes');
            setAllClasses(data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchFiles();
        fetchClasses();
    }, [fetchFiles, fetchClasses]);

    const handleApproval = async (fileId, approved) => {
        try {
            await api.patch(`/admin/files/${fileId}/approve`, { approved });
            fetchFiles();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await api.delete(`/files/${deleteConfirm}`);
            setDeleteConfirm(null);
            fetchFiles();
        } catch (err) {
            setError('Could not delete file.');
        }
    };

    const handleDownload = async (fileId, defaultName) => {
        try {
            const response = await api.get(`/files/download/${fileId}`, {
                responseType: 'blob'
            });

            // Extract filename from Content-Disposition if present
            const disposition = response.headers['content-disposition'];
            let fileName = defaultName;
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/[ '"]/g, '');
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;
        setUploading(true);
        setUploadMsg('');
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            if (uploadClassId) formData.append('classId', uploadClassId);

            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMsg('File integrated successfully.');
            setUploadFile(null);
            setUploadClassId('');
            setShowUpload(false);
            fetchFiles();
        } catch (err) {
            setUploadMsg(err.response?.data?.message || 'Upload protocol failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleView = (file) => {
        const ext = file.fileName?.split('.').pop()?.toLowerCase();
        if (file.source === 'internal') {
            navigate(`/files/view/${file._id}`);
        } else if (ext === 'pdf') {
            window.open(`/files/view/${file._id}`, '_blank');
        } else {
            navigate(`/files/view/${file._id}`);
        }
    };

    const filtered = files.filter(f =>
        f.fileName.toLowerCase().includes(search.toLowerCase()) ||
        f.class?.name.toLowerCase().includes(search.toLowerCase())
    );

    const getFileIcon = (file) => {
        const ext = file.fileName?.split('.').pop()?.toLowerCase();
        if (file.source === 'internal') return <FileText className="text-blue-500" size={20} />;
        if (ext === 'pdf') return <FileIcon className="text-red-500" size={20} />;
        if (['jpg', 'jpeg', 'png'].includes(ext)) return <FileIcon className="text-emerald-500" size={20} />;
        return <FileIcon className="text-slate-400" size={20} />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse text-slate-400">
                <Clock className="mb-4" size={40} />
                <p className="font-semibold uppercase tracking-widest text-xs">Syncing Repository...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">File Repository</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage, audit, and distribute academic documentation.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Upload size={18} />
                        Upload External
                    </button>
                    <Link
                        to={`${basePath}/create-file`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        Draft New
                    </Link>
                </div>
            </div>

            {/* Upload Panel */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-8 mb-8 text-center"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UploadCloud size={32} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Academic Asset</h3>
                            <p className="text-sm text-slate-500 mb-6">Distribute documents across the school network securely.</p>

                            <form onSubmit={handleUpload} className="space-y-4 text-left">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={uploadClassId}
                                        onChange={(e) => setUploadClassId(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none"
                                    >
                                        <option value="">Assign to Class (Optional)</option>
                                        {allClasses.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <Users size={16} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpload(false)}
                                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!uploadFile || uploading}
                                        className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95"
                                    >
                                        {uploading ? 'Processing Transaction...' : 'Establish Upload'}
                                    </button>
                                </div>
                            </form>
                            {uploadMsg && (
                                <p className={`text-xs mt-4 font-bold flex items-center justify-center gap-2 ${uploadMsg.includes('success') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {uploadMsg.includes('success') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    {uploadMsg}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search global repository..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* List View */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Document</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Class</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Agent</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle size={32} className="mb-3 opacity-20" />
                                            <p className="font-semibold text-sm">No assets found matching current filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(file => (
                                    <tr key={file._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-white border border-slate-200 rounded-xl group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="min-w-0">
                                                    <button
                                                        onClick={() => handleView(file)}
                                                        className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate block max-w-[200px] text-left"
                                                    >
                                                        {file.fileName}
                                                    </button>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                                        {new Date(file.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${file.source === 'internal' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {file.source === 'internal' ? 'Internal DB' : 'External FS'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${file.class ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                                                    {file.class?.name || 'Independent'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-700">
                                            {file.uploadedBy?.name || 'System Protocol'}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${file.approved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                                                <span className={`text-xs font-bold ${file.approved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {file.approved ? 'Approved' : 'Awaiting Audit'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDownload(file._id, file.fileName)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Download Asset"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleView(file)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="View Asset"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setDeleteConfirm(file._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete Asset"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                                {isAdmin && !file.approved && (
                                                    <button onClick={() => handleApproval(file._id, true)}
                                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100">
                                                        Authorize
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Trash2 className="text-red-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Asset Deletion</h3>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                    Executing this operation will permanently remove the document from the academic repository. This action cannot be reversed.
                                </p>
                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={handleDelete}
                                        className="w-full py-3.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 active:scale-95 text-sm uppercase tracking-widest"
                                    >
                                        Delete Permanently
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="w-full py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Abort Operation
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilesListPage;
