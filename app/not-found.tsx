import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="heading-1 mb-4">404</h2>
        <p className="text-xl text-muted mb-8">
          Lost at sea? This page doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary">
          Return to Safe Harbor
        </Link>
      </div>
    </div>
  )
}