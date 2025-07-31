export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Chart The Course
          </h1>
          <p className="text-muted">
            Navigate your personal development journey
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}