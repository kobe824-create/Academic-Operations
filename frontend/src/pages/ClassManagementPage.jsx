import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    PlusCircle,
    Search,
    BookOpen,
    ChevronRight,
    Users,
    GraduationCap,
    Sparkles,
    Loader2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassManagementPage = () => {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');
    const [className, setClassName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const basePath = user?.role === 'admin' ? '/admin' : '/teacher';

    const fetchClasses = async () => {
        try {
            const { data } = await api.get('/classes');
            setClasses(data);
        } catch (err) {
            setError('Failed to fetch classes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await api.post('/classes', { name: className });
            setSuccess(`Class "${className}" successfully established.`);
            setClassName('');
            fetchClasses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize class.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const filtered = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <BookOpen className="text-blue-600" size={32} />
                        Academic Units
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Coordinate classrooms and manage student rosters across the institution.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create form - Sticky on desktop */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />

                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                                <PlusCircle size={20} className="text-blue-400" />
                                Initialize New Unit
                            </h3>

                            <form onSubmit={handleCreate} className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Class Name / Designation</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mathematics Section A"
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-xs text-red-400 flex items-center gap-2 font-bold"
                                        >
                                            <AlertCircle size={14} /> {error}
                                        </motion.p>
                                    )}
                                    {success && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-xs text-emerald-400 flex items-center gap-2 font-bold"
                                        >
                                            <CheckCircle2 size={14} /> {success}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <button type="submit"
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                                    Create Unit
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles size={18} className="text-blue-600" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-900">Pro Tip</h4>
                            </div>
                            <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
                                Naming your classes consistently (e.g., Year 10 - Physics - G1) helps teachers find them faster in the repository.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Classes list */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="pl-4 text-slate-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by class name or teacher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 py-3 text-sm outline-none bg-transparent font-medium text-slate-600"
                        />
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
                                <Loader2 size={32} className="animate-spin text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-widest">Querying database...</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-400 text-center px-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                    <BookOpen size={32} className="text-slate-200" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-1">No Academic Units Found</h3>
                                <p className="text-xs font-medium text-slate-500 max-w-[250px]">
                                    {search ? `No results match \"${search}\". Try refining your search parameters.` : 'Start by initializing your first classroom unit using the panel on the left.'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filtered.map((c, i) => (
                                    <motion.div
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link to={`${basePath}/classes/${c._id}`}
                                            className="block p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group relative overflow-hidden">
                                            <div className="flex items-start justify-between relative z-10">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate mb-1">{c.name}</h3>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 py-1">
                                                            <GraduationCap size={14} className="text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                {c.teacher?.name || 'No Faculty Assigned'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 py-1">
                                                            <Users size={14} className="text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                {(c.students || []).length} Students
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>

                                            {/* Decorative background element */}
                                            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                                                <BookOpen size={64} className="text-blue-600" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagementPage;
