import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    Users,
    BookOpen,
    FileStack,
    Clock,
    TrendingUp,
    UserPlus,
    FolderPlus,
    ShieldCheck,
    Activity,
    ChevronRight,
    Database
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, classes: 0, files: 0, pending: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, classesRes, filesRes, logsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/classes'),
                    api.get('/files'),
                    api.get('/activity-logs')
                ]);

                setStats({
                    users: usersRes.data.length,
                    classes: classesRes.data.length,
                    files: filesRes.data.length,
                    pending: filesRes.data.filter(f => !f.approved).length,
                });
                setRecentLogs(logsRes.data.slice(0, 6));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Personnel', value: stats.users, icon: <Users size={20} />, color: 'blue', trend: '+4% vs last month' },
        { label: 'Active Classes', value: stats.classes, icon: <BookOpen size={20} />, color: 'indigo', trend: 'Consistent' },
        { label: 'Digital Assets', value: stats.files, icon: <FileStack size={20} />, color: 'emerald', trend: '+12.5% increase' },
        { label: 'Pending Audit', value: stats.pending, icon: <ShieldCheck size={20} />, color: 'amber', trend: 'Action Required' },
    ];

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
                <Activity size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Oversight</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Welcome back, Director <span className="text-blue-600">{user?.name}</span>.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Status</p>
                    <div className="flex items-center gap-2 justify-end">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Systems Nominal</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-3xl font-black text-slate-900">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <TrendingUp size={12} className="text-emerald-500" />
                            {card.trend}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <Clock size={20} className="text-blue-500" />
                                Operational Audit Trail
                            </h2>
                            <Link to="/admin/activity-log" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                                View Full Archive
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="p-4">
                            {recentLogs.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 italic text-sm">No recent activity detected.</div>
                            ) : (
                                <div className="space-y-1">
                                    {recentLogs.map((log, i) => (
                                        <div key={log._id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
                                                <Activity size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{log.action}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-1 leading-relaxed">
                                                    Executed by <span className="font-bold text-slate-700">{log.user?.name}</span> • {log.details}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
                        <h3 className="text-xl font-bold mb-6 relative z-10">Asset Management</h3>
                        <div className="space-y-3 relative z-10">
                            {[
                                { label: 'Register New Staff', icon: <UserPlus size={18} />, path: '/admin/users' },
                                { label: 'Initialize Class', icon: <FolderPlus size={18} />, path: '/admin/classes' },
                                { label: 'Audit Digital Library', icon: <Database size={18} />, path: '/admin/files' },
                            ].map((action, i) => (
                                <Link key={i} to={action.path} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="text-blue-400 group-hover/item:scale-110 transition-transform">{action.icon}</div>
                                        <span className="text-sm font-bold">{action.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-500 group-hover/item:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-950/40 to-transparent" />
                        <h3 className="text-xl font-bold mb-2">Systems Online</h3>
                        <p className="text-emerald-100 text-xs font-medium mb-6 leading-relaxed">Everything is operating at peak efficiency across all nodes.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Database Synced</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Auth Server Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;