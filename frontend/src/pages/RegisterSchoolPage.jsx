import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterSchoolPage = () => {
    const [form, setForm] = useState({ schoolName: '', adminName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register-school', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Link to="/" className="text-lg font-semibold text-slate-800">Academic Ops</Link>
                    <p className="text-sm text-slate-500 mt-1">Register your school</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                            <input name="schoolName" value={form.schoolName} onChange={handleChange} required
                                placeholder="e.g. Springfield High"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Name</label>
                            <input name="adminName" value={form.adminName} onChange={handleChange} required
                                placeholder="Your full name"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required
                                placeholder="admin@school.com"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} required
                                placeholder="••••••••"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors">
                            {loading ? 'Registering...' : 'Register School'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterSchoolPage;