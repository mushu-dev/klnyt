import type { Order, Customer, LinkValidationCache } from '../types';

export interface BackupSystem {
  saveOrder: (order: Order) => Promise<void>;
  saveCustomer: (customer: Customer) => Promise<void>;
  saveValidation: (validation: LinkValidationCache) => Promise<void>;
  syncWithConvex: () => Promise<void>;
  verifyIntegrity: () => Promise<boolean>;
}

// Generate backup file path (for future file system implementation)
// const getBackupPath = (type: string, id: string): string => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   return `/backups/${type}/${year}-${month}/${type}_${id}.json`;
// };

// Save to local storage (for MVP - in production, use file system)
export const saveToLocalBackup = async (type: string, id: string, data: any): Promise<void> => {
  try {
    const key = `klynt_backup_${type}_${id}`;
    localStorage.setItem(key, JSON.stringify({
      ...data,
      _backupTimestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Backup failed:', error);
    throw new Error('Failed to create backup');
  }
};

// Retrieve from local storage
export const getFromLocalBackup = async (type: string, id: string): Promise<any | null> => {
  try {
    const key = `klynt_backup_${type}_${id}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Backup retrieval failed:', error);
    return null;
  }
};

// List all backups of a type
export const listBackups = (type: string): string[] => {
  const prefix = `klynt_backup_${type}_`;
  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keys.push(key.replace(prefix, ''));
    }
  }
  
  return keys;
};

// Verify backup integrity
export const verifyBackupIntegrity = async (): Promise<boolean> => {
  try {
    const orderBackups = listBackups('order');
    const customerBackups = listBackups('customer');
    
    // Check if critical fields exist in backups
    for (const orderId of orderBackups) {
      const order = await getFromLocalBackup('order', orderId);
      if (!order || !order.orderId || !order.customerInfo) {
        return false;
      }
    }
    
    for (const customerId of customerBackups) {
      const customer = await getFromLocalBackup('customer', customerId);
      if (!customer || !customer.customerId || !customer.email) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Integrity check failed:', error);
    return false;
  }
};

// Create backup system instance
export const createBackupSystem = (): BackupSystem => {
  return {
    saveOrder: async (order: Order) => {
      await saveToLocalBackup('order', order.orderId, order);
    },
    
    saveCustomer: async (customer: Customer) => {
      await saveToLocalBackup('customer', customer.customerId, customer);
    },
    
    saveValidation: async (validation: LinkValidationCache) => {
      const id = btoa(validation.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      await saveToLocalBackup('validation', id, validation);
    },
    
    syncWithConvex: async () => {
      // In production, this would sync local backups with Convex
      console.log('Syncing backups with Convex...');
    },
    
    verifyIntegrity: verifyBackupIntegrity,
  };
};

// Export backup data
export const exportBackupData = (): string => {
  const backupData: any = {
    timestamp: new Date().toISOString(),
    orders: {},
    customers: {},
    validations: {},
  };
  
  // Collect all backup data
  listBackups('order').forEach(id => {
    const order = getFromLocalBackup('order', id);
    if (order) backupData.orders[id] = order;
  });
  
  listBackups('customer').forEach(id => {
    const customer = getFromLocalBackup('customer', id);
    if (customer) backupData.customers[id] = customer;
  });
  
  listBackups('validation').forEach(id => {
    const validation = getFromLocalBackup('validation', id);
    if (validation) backupData.validations[id] = validation;
  });
  
  return JSON.stringify(backupData, null, 2);
};