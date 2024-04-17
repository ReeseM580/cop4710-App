'use client'

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { SearchIcon } from '@heroicons/react/outline';


export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/search?searchTerm=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error searching for users:', err);
            setError('Failed to fetch users.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100vw', 
            minHeight: '100vh', 
            overflowY: 'auto' 
        }}>
            {/* @ts-expect-error Server Component */}
            {<Navbar/>}
            <div style={{ margin: '16px', width: '100%', maxWidth: '600px' }}>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg"
                    style={{ backgroundColor: 'black', color: 'white' }}
                />
                <button
                    onClick={handleSearch}
                    className="ml-4 p-2 black text-white border-2 border-white rounded-lg"
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="mt-4">
                    {users.map((user, index) => (
                        <div key={index} className="p-2 border-b border-gray-300">
                            <p>{user.display_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
