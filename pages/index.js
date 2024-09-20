import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return null // This prevents any flash of content before redirect
  }

  return (
    <div>
      <h1>Welcome, {session.user.name || session.user.email}</h1>
      {/* Add your main app content here */}
    </div>
  )
}
