import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/activity-logs');
                setLogs(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const filtered = logs.filter(log =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (d) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' · ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800">Activity Log</h1>
            <p className="text-sm text-slate-500 mt-0.5 mb-6">Track all actions performed within the system.</p>

            <div className="mb-4">
                <input
                    type="text" placeholder="Search by user, action, or details..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"
                />
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-400">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="font-medium">{search ? 'No logs match your search.' : 'No activity recorded yet.'}</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Action</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(log => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                                        <td className="px-5 py-3">
                                            <div>
                                                <p className="text-sm text-slate-800">{log.user?.name || '—'}</p>
                                                <p className="text-xs text-slate-400 capitalize">{log.user?.role}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-700 font-medium">{log.action}</td>
                                        <td className="px-5 py-3 text-sm text-slate-500">{log.details || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityLogPage;
