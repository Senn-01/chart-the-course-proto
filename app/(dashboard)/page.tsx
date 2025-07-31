import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect to territories as the default module
  redirect('/territories')
}