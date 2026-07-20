const USER_STORAGE_KEY = 'quantum_bill_user';

export function getCurrentUser() {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
}

export function getCurrentUserId() {
    return getCurrentUser()?.id;
}
