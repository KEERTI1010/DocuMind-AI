// BackGuard removed: useBlocker requires a React Router data router,
// which this app does not use. ProtectedRoute already redirects
// unauthenticated users to /login with history replacement, preventing
// back-button access to protected pages.
export default function BackGuard() {
  return null;
}