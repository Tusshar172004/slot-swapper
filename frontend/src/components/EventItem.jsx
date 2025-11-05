import React from 'react';

export default function EventItem({ event, onToggle, onDelete }) {
  return (
    <div className="p-3 bg-white rounded shadow flex justify-between items-center">
      <div>
        <div className="font-semibold">{event.title}</div>
        <div className="text-sm text-gray-500">
          {new Date(event.startTime).toLocaleString()} → {new Date(event.endTime).toLocaleString()}
        </div>
        <div className="text-xs mt-1">Status: {event.status}</div>
      </div>
      <div className="flex gap-2">
        {event.status === 'BUSY' && (
          <button onClick={() => onToggle(event._id, 'SWAPPABLE')} className="px-2 py-1 border rounded">
            Make Swappable
          </button>
        )}
        {event.status === 'SWAPPABLE' && (
          <button onClick={() => onToggle(event._id, 'BUSY')} className="px-2 py-1 border rounded">
            Cancel Swap
          </button>
        )}
        <button onClick={() => onDelete(event._id)} className="text-red-500 text-sm">Delete</button>
      </div>
    </div>
  );
}
