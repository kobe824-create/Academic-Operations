import React from 'react';
import RegisterUserForm from '../../components/RegisterUserForm';
import UserList from '../../components/UserList';

const AdminUsersPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800">User Management</h1>
            <p className="text-sm text-slate-500 mt-0.5 mb-6">Register new users and view all accounts.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <RegisterUserForm />
                </div>
                <div className="lg:col-span-2">
                    <UserList />
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
