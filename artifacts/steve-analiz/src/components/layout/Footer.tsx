export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:px-8 md:py-0 bg-card mt-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Steve Analiz.web. Tüm hakları saklıdır.
        </p>
        <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
          <a href="https://youtube.com/@steveanalizweb" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
