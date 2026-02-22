import React, { useState } from 'react';
import api from '../services/api';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    Shield,
    CheckCircle2,
    AlertCircle,
    Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterUserForm = ({ onUserRegistered }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            await api.post('/admin/register-user', form);
            setSuccess(`Registration successful for ${form.name}.`);
            setForm({ name: '', email: '', password: '', role: 'teacher' });
            if (onUserRegistered) onUserRegistered();
        } catch (err) {
            setError(err.response?.data?.message || 'Access protocol failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <UserPlus size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">Personnel Registration</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Add New Authority</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={16} />
                        </div>
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={16} />
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="personnel@domain.edu"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Lock size={16} />
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Shield size={16} />
                        </div>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="teacher">Teacher / Faculty</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-red-600 mb-2"
                        >
                            <AlertCircle size={14} />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 mb-2"
                        >
                            <CheckCircle2 size={14} />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <Send size={14} />
                            Register Authority
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegisterUserForm;
