import React, { useEffect, useState } from 'react';
import API from '../api/api.js';

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [inc, out] = await Promise.all([
        API.get('/swap/incoming'),
        API.get('/swap/outgoing')
      ]);
      setIncoming(inc.data.filter(r => r.status === 'PENDING'));
      setAccepted(inc.data.filter(r => r.status === 'ACCEPTED'));
      setOutgoing(out.data);
    } catch (err) {
      console.error('Error loading requests:', err);
      alert('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, accept) => {
    try {
      await API.post(`/swap/response/${id}`, { accept });

      if (accept) {
        // Move request to accepted
        const acceptedReq = incoming.find(r => r._id === id);
        setAccepted(prev => [...prev, { ...acceptedReq, status: 'ACCEPTED' }]);
      }
      // Remove from incoming
      setIncoming(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error responding:', err);
      alert('Could not respond to swap');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading swap requests...</p>;

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4">
      {/* Incoming */}
      <div className="bg-white p-4 rounded shadow-sm border">
        <h3 className="font-semibold mb-3 text-gray-800">Incoming Requests</h3>
        {incoming.length === 0 ? (
          <p className="text-gray-500 text-sm">No incoming requests.</p>
        ) : (
          incoming.map(req => (
            <div key={req._id} className="border-b py-2 last:border-none">
              <p className="text-sm font-medium">From: {req.fromUser?.name}</p>
              <p className="text-xs text-gray-500">
                They offered <b>{req.mySlot?.title}</b> for your <b>{req.theirSlot?.title}</b>
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => respond(req._id, true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(req._id, false)}
                  className="px-3 py-1 border text-sm rounded hover:bg-gray-100 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Outgoing */}
      <div className="bg-white p-4 rounded shadow-sm border">
        <h3 className="font-semibold mb-3 text-gray-800">Outgoing Requests</h3>
        {outgoing.length === 0 ? (
          <p className="text-gray-500 text-sm">No outgoing requests.</p>
        ) : (
          outgoing.map(req => (
            <div key={req._id} className="border-b py-2 last:border-none">
              <p className="text-sm font-medium">To: {req.toUser?.name}</p>
              <p className="text-xs text-gray-500">
                You offered <b>{req.mySlot?.title}</b> for <b>{req.theirSlot?.title}</b>
              </p>
              <p className="text-xs mt-1">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    req.status === 'ACCEPTED'
                      ? 'text-green-600'
                      : req.status === 'REJECTED'
                      ? 'text-red-500'
                      : 'text-yellow-600'
                  }`}
                >
                  {req.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* Accepted */}
      <div className="bg-white p-4 rounded shadow-sm border">
        <h3 className="font-semibold mb-3 text-gray-800">Accepted Requests</h3>
        {accepted.length === 0 ? (
          <p className="text-gray-500 text-sm">No accepted requests yet.</p>
        ) : (
          accepted.map(req => (
            <div key={req._id} className="border-b py-2 last:border-none">
              <p className="text-sm font-medium">From: {req.fromUser?.name}</p>
              <p className="text-xs text-gray-500">
                You accepted <b>{req.mySlot?.title}</b> for <b>{req.theirSlot?.title}</b>
              </p>
              <span className="inline-block mt-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                Accepted
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
