export function getRoleHomePath(user) {
    if (user?.status === 'PENDING') return '/owner';
    if (user?.roles?.includes('OWNER')) return '/owner';
    if (user?.roles?.includes('INVESTOR')) return '/investor';
    if (user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN')) return '/admin';
    return '/investor/ranking';
}
