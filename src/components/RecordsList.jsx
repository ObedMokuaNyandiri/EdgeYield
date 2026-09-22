import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

const RecordItem = ({ record }) => (
  <div className="record-card">
    <div>
      <div className="record-title">
        {record.cropType.toUpperCase()} - {record.yieldAmount} kg
        {record.latitude && <MapPin size={14} style={{ marginLeft: '6px', color: '#10b981' }} />}
      </div>
      <div className="record-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
        <span><strong>Farm:</strong> {record.farmId} {record.farmSize ? `(${record.farmSize} acres)` : ''}</span>
        {(record.farmerAge || record.farmerGender) && (
          <span><strong>Farmer:</strong> {record.farmerGender || 'Unknown'} {record.farmerAge ? `, ${record.farmerAge} yrs` : ''}</span>
        )}
        {(record.irrigation || record.fertilizer) && (
          <span><strong>Method:</strong> {record.irrigation || 'Unknown irrigation'}, {record.fertilizer || 'Unknown fertilizer'}</span>
        )}
        {record.notes && <span><strong>Notes:</strong> {record.notes}</span>}
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

  const clearData = async () => {
    if (window.confirm("Are you sure you want to clear all local data? This is useful for resetting demos.")) {
      await db.cropYields.clear();
    }
  };

  if (!records) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const totalYield = records.reduce((sum, r) => sum + (r.yieldAmount || 0), 0);
  const pendingCount = records.filter(r => r.syncStatus === 'pending').length;
  const syncedCount = records.filter(r => r.syncStatus === 'synced').length;

  return (
    <div className="glass-panel" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="title-gradient">Collected Data ({records.length})</h3>
        {records.length > 0 && (
          <button onClick={clearData} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Clear Data
          </button>
        )}
      </div>

      {records.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Yield</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalYield.toLocaleString()} kg</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Sync</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>{pendingCount}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Synced</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{syncedCount}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.map(record => (
              <RecordItem key={record.id} record={record} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
          <p>No records found. Data collected offline will appear here.</p>
        </div>
      )}
    </div>
  );
}
