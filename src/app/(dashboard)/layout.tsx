import { Navbar } from "@/components/layout/navbar"
import { RequireAuth } from "@/components/auth/require-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </RequireAuth>
  )
}