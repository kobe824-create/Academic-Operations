import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Files,
    FilePlus,
    ClipboardList,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';
    const basePath = isAdmin ? '/admin' : '/teacher';

    const navItems = [
        {
            path: `${basePath}/dashboard`,
            label: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
        },
        ...(isAdmin ? [{
            path: '/admin/users',
            label: 'User Management',
            icon: <Users size={20} />,
        }] : []),
        {
            path: `${basePath}/classes`,
            label: 'Academic Classes',
            icon: <BookOpen size={20} />,
        },
        {
            path: `${basePath}/files`,
            label: 'File Repository',
            icon: <Files size={20} />,
        },
        {
            path: `${basePath}/create-file`,
            label: 'Draft New File',
            icon: <FilePlus size={20} />,
        },
        ...(isAdmin ? [{
            path: '/admin/activity-log',
            label: 'Audit Records',
            icon: <ClipboardList size={20} />,
        }] : []),
    ];

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen shadow-2xl z-20">
            {/* Brand Header */}
            <div className="px-8 py-8 flex flex-col">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <motion.div
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <BookOpen className="text-white" size={24} strokeWidth={2.5} />
                        </motion.div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">Academic<span className="text-blue-500">Ops</span></h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{user?.role} Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
                {navItems.map((item, idx) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                ? 'bg-blue-600/10 text-blue-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3.5">
                                    <span className={`transition-colors duration-300 ${isActive ? 'text-blue-500' : 'group-hover:text-blue-400'}`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                                    />
                                )}
                                {!isActive && <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Account Section */}
            <div className="p-4 mx-4 mb-6 mt-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 shadow-inner overflow-hidden">
                            <span className="text-sm font-bold text-blue-400">
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate leading-none mb-1">{user?.name || 'Academic Staff'}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-wider">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;