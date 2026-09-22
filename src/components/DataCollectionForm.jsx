import { useState } from 'react';
import { Save } from 'lucide-react';
import { db } from '../db';

export default function DataCollectionForm() {
  const [cropType, setCropType] = useState('');
  const [yieldAmount, setYieldAmount] = useState('');
  const [farmId, setFarmId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropType || !yieldAmount || !farmId) return;

    setIsSubmitting(true);
    try {
      await db.cropYields.add({
        cropType,
        yieldAmount: parseFloat(yieldAmount),
        farmId,
        notes: notes || '',
        syncStatus: 'pending',
        createdAt: Date.now(),
      });

      // Reset form
      setCropType('');
      setYieldAmount('');
      setFarmId('');
      setNotes('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save record', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel">
      <h2 className="title-gradient" style={{ marginBottom: '1.5rem' }}>Log Crop Yield</h2>
      
      {showSuccess && (
        <div className="badge badge-online" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          ✓ Record saved offline!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="cropType">Crop Type</label>
        <select 
          id="cropType" 
          value={cropType} 
          onChange={(e) => setCropType(e.target.value)}
          required
        >
          <option value="" disabled>Select crop...</option>
          <option value="maize">Maize</option>
          <option value="wheat">Wheat</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="sorghum">Sorghum</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="yieldAmount">Yield Amount (kg)</label>
        <input 
          type="number" 
          id="yieldAmount" 
          step="0.01"
          min="0"
          value={yieldAmount} 
          onChange={(e) => setYieldAmount(e.target.value)}
          placeholder="e.g. 500"
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="farmId">Farm ID</label>
        <input 
          type="text" 
          id="farmId" 
          value={farmId} 
          onChange={(e) => setFarmId(e.target.value)}
          placeholder="e.g. F-12345"
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any observations on weather or pests..."
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        <Save size={18} />
        {isSubmitting ? 'Saving...' : 'Save Record Offline'}
      </button>
    </form>
  );
}
