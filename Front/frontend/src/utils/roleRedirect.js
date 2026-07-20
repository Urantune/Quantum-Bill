export function getRoleHomePath(user) {
    if (user?.status === 'PENDING') return '/investor';
    if (user?.roles?.includes('ADMIN')) return '/admin';
    if (user?.roles?.includes('INVESTOR')) return '/investor';
    if (user?.roles?.includes('OWNER')) return '/owner';
    return '/';
}
