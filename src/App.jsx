import { useState } from 'react'
import DataCollectionForm from './components/DataCollectionForm'
import RecordsList from './components/RecordsList'
import OfflineIndicator from './components/OfflineIndicator'
import './index.css' // Using index.css for global premium styles

function App() {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title-gradient">EdgeYield</h1>
          <p style={{ color: 'var(--text-muted)' }}>Rural Data Sync</p>
        </div>
        <OfflineIndicator isSyncing={isSyncing} />
      </header>

      <main>
        <DataCollectionForm />
        <RecordsList />
      </main>
    </>
  )
}

export default App
