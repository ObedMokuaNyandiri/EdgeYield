import Dexie from 'dexie';

export const db = new Dexie('EdgeYieldDB');

db.version(1).stores({
  cropYields: '++id, cropType, yieldAmount, farmId, notes, syncStatus, createdAt'
});

db.version(2).stores({
  cropYields: '++id, cropType, yieldAmount, farmId, notes, syncStatus, createdAt, farmerGender, irrigation'
});
