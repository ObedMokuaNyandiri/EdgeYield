import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { CheckCircle2, Clock } from 'lucide-react';

const RecordItem = ({ record }) => (
  <div className="record-card">
    <div>
      <div className="record-title">{record.cropType.toUpperCase()} - {record.yieldAmount} kg</div>
      <div className="record-meta">
        <span>Farm ID: {record.farmId}</span>
        {record.notes && <span>Notes: {record.notes}</span>}
      </div>
    </div>
    <div className={`status-icon ${record.syncStatus === 'synced' ? 'synced' : 'pending'}`}>
      {record.syncStatus === 'synced' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
    </div>
  </div>
);

export default function RecordsList() {
  const records = useLiveQuery(
    () => db.cropYields.orderBy('createdAt').reverse().toArray()
  );

  if (!records) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No records found. Data collected offline will appear here.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1rem' }}>Collected Data ({records.length})</h3>
      {records.map(record => (
        <RecordItem key={record.id} record={record} />
      ))}
    </div>
  );
}
