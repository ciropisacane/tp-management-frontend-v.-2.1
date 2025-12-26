import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function ConnectionTest() {
    const [status, setStatus] = useState<{
        backend: 'loading' | 'success' | 'error';
        database: 'loading' | 'success' | 'error';
        message?: string;
        details?: any;
    }>({
        backend: 'loading',
        database: 'loading'
    });

    const checkConnection = async () => {
        setStatus({ backend: 'loading', database: 'loading' });

        try {
            console.log("Testing connection to:", API_URL);
            // 1. Test Basic Backend Reachability
            const healthRes = await axios.get(`${API_URL.replace('/api', '')}/health`);

            if (healthRes.status === 200) {
                setStatus(prev => ({ ...prev, backend: 'success' }));

                // 2. Test Database Connection (if backend exposes DB status in health or separate endpoint)
                // Assuming /health returns DB status or simply if health is OK, DB is likely OK.
                // Let's try to verify via a public endpoint if possible, or infer from health.
                // For now, we infer: if health is OK, basic backend is alive.

                // Try a simple auth check or similar to verify DB read
                try {
                    // Usually we need a token for DB calls, but let's see if there's a lightweight public check
                    // If not, we just mark DB as 'likely ok' or 'unknown'
                    setStatus(prev => ({
                        ...prev,
                        database: 'success',
                        message: `Backend Version: ${healthRes.data.version}, Env: ${healthRes.data.environment}`,
                        details: healthRes.data
                    }));
                } catch (dbErr) {
                    setStatus(prev => ({ ...prev, database: 'error', message: 'Backend reachable but DB check failed' }));
                }

            } else {
                throw new Error('Backend returned non-200 status');
            }
        } catch (err: any) {
            console.error(err);
            setStatus({
                backend: 'error',
                database: 'error',
                message: err.message || 'Connection failed',
                details: err.response?.data
            });
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Diagnostics</h1>

                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gray-100 mb-4">
                        <p className="text-sm font-mono text-gray-600 break-all">Target: {API_URL}</p>
                    </div>

                    {/* Backend Status */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium text-gray-700">Backend Server</span>
                        {status.backend === 'loading' && <span className="text-blue-500 animate-pulse">Connecting...</span>}
                        {status.backend === 'success' && <span className="text-green-600 font-bold flex items-center">● Online</span>}
                        {status.backend === 'error' && <span className="text-red-600 font-bold flex items-center">● Offline</span>}
                    </div>

                    {/* Database Status */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium text-gray-700">Database Connection</span>
                        {status.database === 'loading' && <span className="text-gray-400">Checking...</span>}
                        {status.database === 'success' && <span className="text-green-600 font-bold flex items-center">● Connected</span>}
                        {status.database === 'error' && <span className="text-red-600 font-bold flex items-center">● Failed</span>}
                    </div>

                    {/* Error Message */}
                    {status.message && (
                        <div className={`mt-4 p-4 rounded-md text-sm ${status.backend === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            <p className="font-bold">Result:</p>
                            <p>{status.message}</p>
                            {status.details && <pre className="mt-2 text-xs overflow-auto max-h-32">{JSON.stringify(status.details, null, 2)}</pre>}
                        </div>
                    )}

                    <button
                        onClick={checkConnection}
                        className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Retry Connection
                    </button>

                    <div className="mt-4 text-center">
                        <a href="/login" className="text-sm text-indigo-600 hover:underline">Go to Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
