import React, { useState } from 'react';
import SpinnerIcon from './components/icons/SpinnerIcon';

interface AdminLoginPageProps {
    onLogin: (email: string, password: string) => Promise<string | null>;
    onCancel: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onCancel }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const loginError = await onLogin(email, password);
        if (loginError) {
            setError(loginError);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex items-center justify-between mt-6">
                         <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 w-24 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;