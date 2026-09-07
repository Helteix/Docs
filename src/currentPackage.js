// Sets a `data-pkg` attribute on <html> reflecting which package's docs the
// visitor is currently browsing. The navbar CSS uses it to show only that
// package's version selector (see src/css/custom.css).

const PACKAGES = ['tools', 'singletons', 'channeled-properties', 'graphs', 'cards'];

function resolvePackage(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  return PACKAGES.find((pkg) => segments.includes(pkg)) || '';
}

function apply(pathname) {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.dataset.pkg = resolvePackage(pathname);
}

// Initial client-side render (hydration).
if (typeof window !== 'undefined') {
  apply(window.location.pathname);
}

// Every subsequent client-side navigation.
export function onRouteDidUpdate({location}) {
  apply(location && location.pathname);
}
