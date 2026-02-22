import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Nav */}
            <header className="flex items-center justify-between px-8 lg:px-16 h-16 border-b border-gray-100">
                <h1 className="text-lg font-semibold text-slate-800">Academic Ops</h1>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Log in</Link>
                    <Link to="/register-school" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 max-w-2xl leading-tight">
                    Streamline your school's academic operations
                </h2>
                <p className="text-lg text-slate-500 mt-4 max-w-xl">
                    Manage classes, files, students, and approvals — all in one place. Built for administrators and teachers.
                </p>
                <div className="flex items-center gap-3 mt-8">
                    <Link to="/register-school" className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        Register Your School
                    </Link>
                    <Link to="/login" className="px-6 py-3 text-sm font-medium text-slate-600 bg-white border border-gray-200 hover:border-blue-300 rounded-lg transition-colors">
                        Log In
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
                    {[
                        { title: 'Class Management', desc: 'Organize classes and student rosters effortlessly.' },
                        { title: 'File Workflows', desc: 'Upload, create, and approve documents with clear status tracking.' },
                        { title: 'Activity Tracking', desc: 'See who did what with a full audit trail.' },
                    ].map((f, i) => (
                        <div key={i} className="text-left p-5 rounded-lg border border-gray-100">
                            <h3 className="text-sm font-semibold text-slate-800">{f.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="text-center py-6 text-xs text-slate-400">
                © {new Date().getFullYear()} Academic Ops
            </footer>
        </div>
    );
};

export default HomePage;