export function getEffectiveRole(user) {
    const roles = user?.roles || [];
    if (user?.username === 'admin') return 'ADMIN';
    if (user?.status === 'PENDING') return 'INVESTOR';
    if (roles.includes('OWNER')) return 'OWNER';
    if (roles.includes('INVESTOR')) return 'INVESTOR';
    if (roles.includes('ADMIN')) return 'ADMIN';
    return null;
}

export function getRoleHomePath(user) {
    if (user?.status === 'PENDING') return '/investor';
    const role = getEffectiveRole(user);
    if (role === 'ADMIN') return '/admin';
    if (role === 'INVESTOR') return '/investor';
    if (role === 'OWNER') return '/owner';
    return '/';
}
