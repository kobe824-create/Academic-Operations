import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
    ShieldCheck,
    Building2,
    MapPin,
    User,
    Mail,
    Lock,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterSchoolPage = () => {
    const [form, setForm] = useState({
        schoolName: '',
        schoolAddress: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Mapping frontend state to backend expected fields
            await api.post('/schools/register', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please attempt again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl"
            >
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/30 mb-5 text-white rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Establish <span className="text-blue-600">Institution</span></h1>
                    <p className="text-slate-500 text-sm font-medium">Join the Secure Academic Operations Network</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-2xl shadow-slate-200/50 relative">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* School Info Section */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Institutional Identity</label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <Building2 size={18} />
                                        </div>
                                        <input
                                            name="schoolName"
                                            value={form.schoolName}
                                            onChange={handleChange}
                                            required
                                            placeholder="School Official Name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            name="schoolAddress"
                                            value={form.schoolAddress}
                                            onChange={handleChange}
                                            required
                                            placeholder="Physical Campus Address"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Admin Info Section */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 mt-4">Administrative Authority</label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            name="adminName"
                                            value={form.adminName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Headmaster / Director Full Name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            name="adminEmail"
                                            type="email"
                                            value={form.adminEmail}
                                            onChange={handleChange}
                                            required
                                            placeholder="Institutional Email Identifier"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            name="adminPassword"
                                            type="password"
                                            value={form.adminPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Secure Access Key"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Initialize Institution
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            Already registered?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors ml-1 uppercase tracking-widest text-[10px]">
                                Secure Login
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterSchoolPage;