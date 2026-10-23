/** Shown briefly while new content (added since the last build) loads. */
export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep" aria-busy="true" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  );
}
