import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ClassDetailsPage = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const basePath = user?.role === 'admin' ? '/admin' : '/teacher';

    const fetchClass = async () => {
        try {
            const { data } = await api.get(`/classes/${classId}`);
            setClassData(data);
        } catch (err) { setError('Failed to load class.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchClass(); }, [classId]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await api.post(`/classes/${classId}/students`, { name: studentName, studentId });
            setSuccess(`Student "${studentName}" added.`);
            setStudentName(''); setStudentId('');
            fetchClass();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student.');
        }
    };

    if (loading) return <div className="text-center py-16 text-slate-400">Loading...</div>;
    if (!classData) return <div className="text-center py-16 text-red-600">Class not found</div>;

    return (
        <div>
            <Link to={`${basePath}/classes`} className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Classes
            </Link>

            <h1 className="text-2xl font-semibold text-slate-800">{classData.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5 mb-8">
                {classData.teacher?.name ? `Teacher: ${classData.teacher.name}` : 'No teacher assigned'}
                {' · '}{classData.students?.length || 0} students
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add student form */}
                <div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Student</h3>
                        <form onSubmit={handleAddStudent} className="space-y-3">
                            <input type="text" placeholder="Student name" value={studentName}
                                onChange={e => setStudentName(e.target.value)} required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                            <input type="text" placeholder="Student ID" value={studentId}
                                onChange={e => setStudentId(e.target.value)} required
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors" />
                            {error && <p className="text-xs text-red-600">{error}</p>}
                            {success && <p className="text-xs text-green-600">{success}</p>}
                            <button type="submit"
                                className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                Add Student
                            </button>
                        </form>
                    </div>
                </div>

                {/* Student list */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {!classData.students?.length ? (
                            <div className="text-center py-12 text-slate-400">
                                <p className="font-medium">No students yet.</p>
                            </div>
                        ) : (
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student ID</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classData.students.map((s, i) => (
                                        <tr key={s._id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 text-sm text-slate-400">{i + 1}</td>
                                            <td className="px-5 py-3 text-sm text-slate-500 font-mono">{s.studentId}</td>
                                            <td className="px-5 py-3 text-sm text-slate-800">{s.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsPage;
