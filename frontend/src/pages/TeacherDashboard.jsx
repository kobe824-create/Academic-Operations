import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    BookOpen,
    FileStack,
    Clock,
    PlusCircle,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Users,
    Send,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({ classes: 0, myFiles: 0, allFiles: 0, pending: 0 });
    const [myRecentFiles, setMyRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const [classesRes, filesRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/files'),
                ]);
                const myFiles = filesRes.data.filter(f => f.uploadedBy?._id === user?.id || f.uploadedBy === user?.id);
                setStats({
                    classes: classesRes.data.length,
                    myFiles: myFiles.length,
                    allFiles: filesRes.data.length,
                    pending: myFiles.filter(f => !f.approved).length,
                });
                setMyRecentFiles(myFiles.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherData();
    }, [user?.id]);

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await api.get(`/files/download/${fileId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 animate-pulse text-slate-400">
                <Send size={32} className="animate-bounce" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Faculty Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Good day, <span className="text-blue-600 font-bold">{user?.name}</span>. Manage your curriculum and student assets here.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/teacher/create-file" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                        <PlusCircle size={14} />
                        New Draft
                    </Link>
                </div>
            </div>

            {/* Quick Metrics */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                {[
                    { label: 'Assigned Classes', value: stats.classes, icon: <BookOpen size={20} />, color: 'blue' },
                    { label: 'My Contributions', value: stats.myFiles, icon: <FileStack size={20} />, color: 'emerald' },
                    { label: 'School Archive', value: stats.allFiles, icon: <Users size={20} />, color: 'indigo' },
                    { label: 'Under Review', value: stats.pending, icon: <AlertCircle size={20} />, color: 'amber' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{card.value}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Recent Contributions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <Clock size={20} className="text-blue-500" />
                                Recent Uploads
                            </h2>
                            <Link to="/teacher/files" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                                Open Repository
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="p-2">
                            {myRecentFiles.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 italic text-sm">No recent uploads initiated.</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Filename</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {myRecentFiles.map(file => (
                                            <tr key={file._id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                            <FileStack size={16} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.fileName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {file.approved ? (
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                        ) : (
                                                            <Clock size={14} className="text-amber-500" />
                                                        )}
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${file.approved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {file.approved ? 'Live' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDownload(file._id, file.fileName)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Teacher Shortcuts */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-xl font-bold mb-6">Course Management</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Manage Classes', icon: <BookOpen size={18} />, path: '/teacher/classes' },
                                { label: 'System Repository', icon: <FileStack size={18} />, path: '/teacher/files' },
                                { label: 'Upload New Asset', icon: <PlusCircle size={18} />, path: '/teacher/files' },
                            ].map((action, i) => (
                                <Link key={i} to={action.path} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="text-blue-400">{action.icon}</div>
                                        <span className="text-sm font-bold">{action.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-500" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <Send size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Support Portal</h4>
                                <p className="text-xs font-bold text-slate-500">Need assistance?</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                            If you require technical support regarding file approvals or class assignments, please contact the IT administration desk.
                        </p>
                        <button className="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all text-xs uppercase tracking-widest">
                            Contact Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;