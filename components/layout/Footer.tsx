export function Footer() {
  return (
    <footer className="bg-white border-t border-muted/20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted">
        <p>© {new Date().getFullYear()} Chart The Course. All rights reserved.</p>
        <p className="text-center">Navigate your professional journey with purpose.</p>
      </div>
    </footer>
  )
}