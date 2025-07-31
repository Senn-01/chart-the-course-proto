import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-1 mb-6">
            Chart The Course
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto">
            Navigate your personal and professional development with strategic clarity. 
            Transform abstract vision into consistent daily action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary">
              Begin Your Journey
            </Link>
            <Link href="/login" className="btn-ghost">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-2 text-center mb-16">
            Your Strategic Command Center
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Uncharted Territories"
              description="Capture ideas with zero friction. Your thoughts, instantly preserved."
              icon="🗺️"
            />
            <FeatureCard
              title="True North Compass"
              description="Define your vision with AI guidance. Clarity on what truly matters."
              icon="🧭"
            />
            <FeatureCard
              title="The Chart Room"
              description="Map initiatives by impact and effort. Strategic decisions made visual."
              icon="📊"
            />
            <FeatureCard
              title="The Daily Expedition"
              description="90-minute focused work sessions. Deep work, measured and rewarded."
              icon="⏱️"
            />
            <FeatureCard
              title="Captain's Log"
              description="Voice-based daily reflections. Your journey, documented effortlessly."
              icon="📝"
            />
            <FeatureCard
              title="Reading the Wake"
              description="Visualize progress and patterns. Your efforts, clearly tracked."
              icon="📈"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-3 mb-6">
            Ready to Chart Your Course?
          </h2>
          <p className="text-lg text-muted mb-8">
            Join knowledge workers who are turning vision into reality through consistent, focused effort.
          </p>
          <Link href="/register" className="btn-secondary">
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="small-text italic">
            &quot;The world is a fine place and worth fighting for...&quot;
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ title, description, icon }: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  )
}