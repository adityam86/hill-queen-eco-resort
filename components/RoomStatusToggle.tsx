'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoomStatusToggleProps {
  roomId: string;
  initialStatus: boolean;
}

export default function RoomStatusToggle({ roomId, initialStatus }: RoomStatusToggleProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = !isActive;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setIsActive(newStatus);
      router.refresh();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update room status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 ${
        isActive
          ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
      />
      <span>{loading ? 'Updating...' : isActive ? 'Active' : 'Inactive'}</span>
    </button>
  );
}
