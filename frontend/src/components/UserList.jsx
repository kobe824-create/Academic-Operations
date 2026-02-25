import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const refetch = () => {
        api.get('/admin/users').then(res => setUsers(res.data)).catch(() => { });
    };

    if (loading) return <div className="text-center py-12 text-slate-400">Loading...</div>;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-slate-700">{users.length} Users</h3>
            </div>
            {users.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No users found.</div>
            ) : (
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 text-sm text-slate-800">{u.name}</td>
                                <td className="px-5 py-3 text-sm text-slate-500">{u.email}</td>
                                <td className="px-5 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-slate-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;