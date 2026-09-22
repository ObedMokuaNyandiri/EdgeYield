import { db } from './index';

export async function syncData() {
  try {
    // Get all unsynced records
    const unsyncedRecords = await db.cropYields
      .where('syncStatus')
      .equals('pending')
      .toArray();

    if (unsyncedRecords.length === 0) {
      console.log('No records to sync.');
      return;
    }

    console.log(`Syncing ${unsyncedRecords.length} records to server...`);

    // Simulate network delay (replace with real API call in production)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mark all as synced
    const ids = unsyncedRecords.map(r => r.id);
    await db.cropYields.where('id').anyOf(ids).modify({ syncStatus: 'synced' });

    console.log('Sync successful!');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
