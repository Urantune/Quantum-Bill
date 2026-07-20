export function getRoleHomePath(user) {
    if (user?.status === 'PENDING') return '/owner';
    if (user?.roles?.includes('OWNER')) return '/owner';
    if (user?.roles?.includes('INVESTOR')) return '/investor';
    return '/investor/ranking';
}
