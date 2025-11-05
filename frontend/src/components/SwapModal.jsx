import React, { useEffect, useState } from 'react';
import API from '../api/api.js';

export default function SwapModal({ open, onClose, target }) {
  const [mySlots, setMySlots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) {
      API.get('/events/me').then(res => {
        setMySlots(res.data.filter(e => e.status === 'SWAPPABLE'));
      });
    }
  }, [open]);

  const requestSwap = async () => {
    if (!selected) return alert('Select one of your swappable slots.');
    try {
      await API.post('/swap/request', { mySlotId: selected, theirSlotId: target._id });
      alert('Swap request sent!');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting swap');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 shadow-lg">
        <h3 className="font-semibold">Swap with: {target.title}</h3>
        <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
          {mySlots.map((slot) => (
            <div key={slot._id}
              className={`p-2 border rounded cursor-pointer ${selected === slot._id ? 'border-indigo-500' : ''}`}
              onClick={() => setSelected(slot._id)}>
              <div className="font-medium">{slot.title}</div>
              <div className="text-xs text-gray-500">{new Date(slot.startTime).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={requestSwap} className="px-3 py-1 bg-indigo-600 text-white rounded">Request Swap</button>
        </div>
      </div>
    </div>
  );
}
