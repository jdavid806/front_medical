export async function authMiddleware() {
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    console.log("middleware authMiddlewareAsync - currentPath:", currentPath);

    const publicRoutes = ['inicio', 'Dashboard', 'noAutorizado'];

    let permissions = [];
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        const stored = localStorage.getItem('permissionsAuthRoute');
        if (stored) {
            permissions = JSON.parse(stored);
            break;
        }
        
        await new Promise(res => setTimeout(res, 100));
        retries++;
    }

    const allowedUrls = permissions.map(menu => menu.url).filter(url => url);

    if (publicRoutes.includes(currentPath)) return true;

    if (!allowedUrls.includes(currentPath)) {
        // alert('No tienes permiso para acceder a esta página.');
        // console.log('Redirigiendo a Dashboard...');
        window.location.href = '/Dashboard';
        return false;
    }

    return true;
}
