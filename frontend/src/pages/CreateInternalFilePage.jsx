import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    FileText,
    ChevronRight,
    ChevronLeft,
    Save,
    Users,
    Target,
    CheckCircle2,
    AlertCircle,
    Clock,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateInternalFilePage = () => {
    const [step, setStep] = useState(1);
    const [fileName, setFileName] = useState('');
    const [classId, setClassId] = useState('');
    const [targetMarks, setTargetMarks] = useState(100);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentMarks, setStudentMarks] = useState({}); // { studentId: mark }
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/classes').then(res => setClasses(res.data)).catch(() => { });
    }, []);

    const fetchStudents = async () => {
        if (!classId) return;
        setLoading(true);
        try {
            // Assuming there's an endpoint to get class details including students
            const { data } = await api.get(`/classes/${classId}`);
            setStudents(data.students || []);
            // Initialize marks
            const initialMarks = {};
            data.students?.forEach(s => {
                initialMarks[s._id] = '';
            });
            setStudentMarks(initialMarks);
            setStep(2);
        } catch (err) {
            setError('Failed to fetch class roster.');
        } finally {
            setLoading(false);
        }
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!fileName || !classId || !targetMarks) {
            setError('Please complete all configuration fields.');
            return;
        }
        setError('');
        fetchStudents();
    };

    const handleFinalSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const payload = {
                fileName,
                fileType: 'marks',
                classId,
                content: {
                    classId,
                    targetMarks,
                    students: students.map(s => ({
                        studentId: s._id,
                        name: s.name,
                        marks: studentMarks[s._id] || 0
                    }))
                }
            };
            await api.post('/files/internal', payload);
            setSuccess(`Marks sheet "${fileName}" has been successfully published.`);
            setTimeout(() => navigate('/teacher/files'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save marks sheet.');
        } finally {
            setLoading(false);
        }
    };

    const updateMark = (id, val) => {
        const numVal = parseFloat(val);
        if (numVal > targetMarks) return; // Prevent exceeding target
        if (numVal < 0) return;
        setStudentMarks(prev => ({ ...prev, [id]: val }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Wizard Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <FileText size={20} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Marks Sheet Wizard</h1>
                </div>
                <p className="text-slate-500 font-medium">Step {step}: {step === 1 ? 'Configure Assessment' : 'Individual Grade Entry'}</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-10 px-2">
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm"
                    >
                        <form onSubmit={handleStep1Submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Archive Designation</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                                <Layout size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={fileName}
                                                onChange={e => setFileName(e.target.value)}
                                                required
                                                placeholder="e.g. Mid-Term Physics Assessment"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Academic Unit</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                                <Users size={18} />
                                            </div>
                                            <select
                                                value={classId}
                                                onChange={e => setClassId(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700 appearance-none"
                                            >
                                                <option value="">Select Target Class</option>
                                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Maximum Scale (Target Marks)</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                                <Target size={18} />
                                            </div>
                                            <input
                                                type="number"
                                                value={targetMarks}
                                                onChange={e => setTargetMarks(e.target.value)}
                                                required
                                                placeholder="e.g. 100"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 mt-auto">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2 flex items-center gap-2">
                                            <Clock size={14} /> Protocol Information
                                        </h4>
                                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                            Establishing a target mark will enforce a validation threshold during the grade entry phase, preventing erroneous data input above the maximum scale.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                                        <AlertCircle size={18} /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                                >
                                    {loading ? <Clock className="animate-spin" size={18} /> : <>Initialize Roster <ChevronRight size={18} /></>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">{fileName}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Target: <span className="text-blue-600 font-black">{targetMarks}</span> • Unit: {classes.find(c => c._id === classId)?.name}</p>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            </div>

                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr className="border-b border-slate-100 bg-white">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">Academic Mark</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.map((s, idx) => (
                                            <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-900/10">
                                                            {s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{s.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.studentId}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end relative">
                                                        <input
                                                            type="number"
                                                            value={studentMarks[s._id]}
                                                            onChange={e => updateMark(s._id, e.target.value)}
                                                            placeholder="0.0"
                                                            className="w-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-right text-sm font-black text-slate-900 outline-none focus:border-blue-500/50 focus:bg-white transition-all"
                                                        />
                                                        {studentMarks[s._id] !== '' && parseFloat(studentMarks[s._id]) === parseFloat(targetMarks) && (
                                                            <div className="absolute -left-6 text-emerald-500">
                                                                <CheckCircle2 size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <AnimatePresence>
                            {success && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-emerald-600 rounded-[2rem] text-white flex items-center gap-4 shadow-xl shadow-emerald-900/20">
                                    <div className="p-2 bg-white/20 rounded-xl"><CheckCircle2 size={24} /></div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-[0.1em]">Execution Successful</p>
                                        <p className="text-xs font-medium text-emerald-50 opacity-90">{success}</p>
                                    </div>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-4 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={16} /> Reconfigure
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={loading}
                                className="px-12 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-slate-900/30 active:scale-[0.98]"
                            >
                                {loading ? <Clock className="animate-spin" size={18} /> : <>Commmit to Archive <Save size={18} /></>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateInternalFilePage;
