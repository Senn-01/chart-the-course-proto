# Chart The Course

A minimalist SaaS web application for knowledge workers, designed as a strategic orchestrator for personal and professional development. Chart The Course measures and gamifies deep work sessions, helping users translate abstract vision into consistent daily effort.

## Features

### 🗺️ Core Modules

1. **Uncharted Territories** - Capture and triage ideas with zero friction
2. **True North Compass** - Create your personal vision with AI guidance
3. **The Chart Room** - Map initiatives on an Impact/Effort matrix
4. **The Daily Expedition** - 90-minute focused work sessions
5. **Captain's Log** - Voice-based daily reflections
6. **Reading the Wake** - Analytics and progress visualization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **AI**: OpenAI (GPT-4o-mini, Whisper)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chart-the-course.git
   cd chart-the-course
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual values:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `OPENAI_API_KEY` - Your OpenAI API key (optional for now, uses placeholders)

4. Set up the database:
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/` in order:
     - `001_initial_schema.sql`
     - `002_fix_function_search_paths.sql`
   - The RLS policies are already included in the migrations

5. Deploy Edge Functions (optional - for AI features):
   ```bash
   npx supabase functions deploy vision-chat
   npx supabase functions deploy transcribe-log
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard routes
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   └── modules/        # Feature-specific components
├── lib/                # Utilities and configurations
│   ├── supabase/       # Supabase client setup
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript types
├── supabase/           # Database and backend
│   ├── migrations/     # SQL migrations
│   └── functions/      # Edge Functions
└── tests/              # Test files
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

- `profiles` - User profiles
- `ideas` - Captured ideas (Uncharted Territories)
- `vision` - User vision documents (True North Compass)
- `initiatives` - Strategic initiatives (The Chart Room)
- `work_sessions` - Timed work sessions (The Daily Expedition)
- `log_entries` - Daily reflections (Captain's Log)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Start the server:
   ```bash
   npm start
   ```

## Security

- All database tables use Row Level Security (RLS)
- Authentication handled by Supabase Auth
- API routes protected by middleware
- Environment variables for sensitive data
- Input validation on all forms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the principles of deep work and strategic thinking
- Built with modern web technologies for optimal performance
- Designed with minimalism and focus in mind

---

*"The world is a fine place and worth fighting for..."* - Ernest Hemingway