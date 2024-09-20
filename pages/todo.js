import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Todo() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1>Todo Page</h1>
      <p>Welcome, {session.user.name || session.user.email}</p>
      {/* Add your todo list functionality here */}
    </div>
  );
}
