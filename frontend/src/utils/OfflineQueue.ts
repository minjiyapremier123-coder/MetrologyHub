import { get, set, update } from 'idb-keyval';

export interface PendingScan {
    id: string; // unique offline queue temp ID
    file: File;
    timestamp: string;
    productName: string;
    officer: string;
}

export const OFFLINE_QUEUE_KEY = 'metrology_offline_queue';

export const saveToOfflineQueue = async (scan: PendingScan) => {
    try {
        await update(OFFLINE_QUEUE_KEY, (val: any) => {
            const queue = (val as PendingScan[]) || [];
            return [...queue, scan];
        });
        console.log('Saved to offline queue successfully:', scan.id);
    } catch (err) {
        console.error('Failed to save to offline queue', err);
    }
};

export const getOfflineQueue = async (): Promise<PendingScan[]> => {
    try {
        const queue = await get(OFFLINE_QUEUE_KEY);
        return (queue as PendingScan[]) || [];
    } catch (err) {
        return [];
    }
};

export const clearOfflineQueue = async () => {
    try {
        await set(OFFLINE_QUEUE_KEY, []);
    } catch (err) {
        console.error('Failed to clear queue', err);
    }
};

export const removeOfflineScan = async (id: string) => {
    try {
        await update(OFFLINE_QUEUE_KEY, (val: any) => {
            const queue = (val as PendingScan[]) || [];
            return queue.filter(s => s.id !== id);
        });
    } catch (e) {
        console.error('Failed to remove scan ' + id);
    }
};
