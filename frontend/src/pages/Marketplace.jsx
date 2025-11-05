import React, { useEffect, useState } from 'react';
import API from '../api/api.js';
import SwapModal from '../components/SwapModal.jsx';

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get('/events/swappable');
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching marketplace slots:', err);
      alert('Failed to load marketplace slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p>Loading marketplace...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Marketplace</h2>

      {slots.length === 0 ? (
        <p className="text-gray-500">
          No swappable events available right now. Ask another user to mark one as swappable!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {slots.map(slot => (
            <div key={slot._id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{slot.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(slot.startTime).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Owner: {slot.owner?.name || 'Unknown'}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => { setTarget(slot); setOpen(true); }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Request Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SwapModal
        open={open}
        target={target}
        onClose={() => { setOpen(false); setTarget(null); }}
      />
    </div>
  );
}
