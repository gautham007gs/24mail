export function UseCasesSection() {
  return (
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-border/30 fade-in-up">
      <div className="text-center mb-10 md:mb-12 space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Why Use Burner Email?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Protect your real inbox with disposable email for any situation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">📰</span>
            <h3 className="font-semibold text-foreground">Newsletter Signups</h3>
          </div>
          <p className="text-sm text-muted-foreground">Sign up for newsletters and marketing emails without cluttering your real inbox</p>
        </div>
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">🧪</span>
            <h3 className="font-semibold text-foreground">Test Apps & Sites</h3>
          </div>
          <p className="text-sm text-muted-foreground">Developer and QA testing without creating permanent accounts</p>
        </div>
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">🎁</span>
            <h3 className="font-semibold text-foreground">Free Trial Access</h3>
          </div>
          <p className="text-sm text-muted-foreground">Use multiple trials without getting marked as a repeat customer</p>
        </div>
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">🔒</span>
            <h3 className="font-semibold text-foreground">Avoid Data Breaches</h3>
          </div>
          <p className="text-sm text-muted-foreground">If a site gets breached, your real email stays completely safe</p>
        </div>
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">⬇️</span>
            <h3 className="font-semibold text-foreground">Download Files</h3>
          </div>
          <p className="text-sm text-muted-foreground">Get files from sketchy sites without exposing your real identity</p>
        </div>
        <div className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">👤</span>
            <h3 className="font-semibold text-foreground">Online Privacy</h3>
          </div>
          <p className="text-sm text-muted-foreground">Stay anonymous and avoid targeted ads and spam</p>
        </div>
      </div>
    </section>
  );
}
