import { useState } from 'react';
import { Save, MapPin } from 'lucide-react';
import { db } from '../db';

export default function DataCollectionForm() {
  const [cropType, setCropType] = useState('');
  const [yieldAmount, setYieldAmount] = useState('');
  const [farmId, setFarmId] = useState('');
  
  // New Demographic & Farming Data
  const [farmerGender, setFarmerGender] = useState('');
  const [farmerAge, setFarmerAge] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  
  // Geospatial Data
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error capturing location", error);
        alert("Unable to retrieve your location. Please check device permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropType || !yieldAmount || !farmId) return;

    setIsSubmitting(true);
    try {
      await db.cropYields.add({
        cropType,
        yieldAmount: parseFloat(yieldAmount),
        farmId,
        farmerGender,
        farmerAge: farmerAge ? parseInt(farmerAge, 10) : null,
        farmSize: farmSize ? parseFloat(farmSize) : null,
        irrigation,
        fertilizer,
        latitude: location ? location.lat : null,
        longitude: location ? location.lng : null,
        notes: notes || '',
        syncStatus: 'pending',
        createdAt: Date.now(),
      });

      // Reset form
      setCropType('');
      setYieldAmount('');
      setFarmId('');
      setFarmerGender('');
      setFarmerAge('');
      setFarmSize('');
      setIrrigation('');
      setFertilizer('');
      setLocation(null);
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
    <form onSubmit={handleSubmit} className="glass-panel" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <h2 className="title-gradient" style={{ marginBottom: '1.5rem' }}>Log Crop Yield & Demographics</h2>
      
      {showSuccess && (
        <div className="badge badge-online" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          ✓ Record saved offline!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="farmId">Farm ID / National ID</label>
          <input type="text" id="farmId" value={farmId} onChange={(e) => setFarmId(e.target.value)} placeholder="e.g. F-12345" required />
        </div>
        <div className="form-group">
          <label htmlFor="farmSize">Farm Size (Acres)</label>
          <input type="number" id="farmSize" step="0.1" min="0" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 2.5" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="farmerGender">Farmer Gender</label>
          <select id="farmerGender" value={farmerGender} onChange={(e) => setFarmerGender(e.target.value)}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="farmerAge">Farmer Age</label>
          <input type="number" id="farmerAge" min="18" max="120" value={farmerAge} onChange={(e) => setFarmerAge(e.target.value)} placeholder="e.g. 45" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="cropType">Crop Type</label>
          <select id="cropType" value={cropType} onChange={(e) => setCropType(e.target.value)} required>
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
          <input type="number" id="yieldAmount" step="0.01" min="0" value={yieldAmount} onChange={(e) => setYieldAmount(e.target.value)} placeholder="e.g. 500" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="irrigation">Irrigation Method</label>
          <select id="irrigation" value={irrigation} onChange={(e) => setIrrigation(e.target.value)}>
            <option value="">Select...</option>
            <option value="rainfed">Rainfed</option>
            <option value="drip">Drip Irrigation</option>
            <option value="sprinkler">Sprinkler</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fertilizer">Fertilizer Used</label>
          <select id="fertilizer" value={fertilizer} onChange={(e) => setFertilizer(e.target.value)}>
            <option value="">Select...</option>
            <option value="organic">Organic / Manure</option>
            <option value="chemical">Chemical (NPK, etc.)</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Geospatial Location</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button type="button" onClick={captureLocation} className="btn" style={{ background: 'rgba(255,255,255,0.1)', flex: 1, justifyContent: 'center' }} disabled={isLocating}>
            <MapPin size={18} />
            {isLocating ? 'Acquiring GPS...' : 'Capture GPS Coordinates'}
          </button>
          {location && (
            <div style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ✓ Captured
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Pests, Weather, etc.)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any observations on weather or pests..." rows="2" />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
        <Save size={18} />
        {isSubmitting ? 'Saving...' : 'Save Record Offline'}
      </button>
    </form>
  );
}
