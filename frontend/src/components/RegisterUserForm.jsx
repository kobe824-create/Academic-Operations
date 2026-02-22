import React, { useState } from 'react';
import api from '../services/api';

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
            setSuccess(`${form.role} "${form.name}" registered.`);
            setForm({ name: '', email: '', password: '', role: 'teacher' });
            if (onUserRegistered) onUserRegistered();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Register New User</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                <select name="role" value={form.role} onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors bg-white">
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                {error && <p className="text-xs text-red-600">{error}</p>}
                {success && <p className="text-xs text-green-600">{success}</p>}
                <button type="submit" disabled={loading}
                    className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors">
                    {loading ? 'Registering...' : 'Register User'}
                </button>
            </form>
        </div>
    );
};

export default RegisterUserForm;