import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    router.push('/todo');
    return null;
  }

  return (
    <Layout>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome to the Sentiment Todo App</h1>
        <p>Track your tasks and analyze your mood!</p>
        <div style={{ marginTop: '20px' }}>
          <Link href="/login">
            <a style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', marginRight: '10px' }}>Log In</a>
          </Link>
          <Link href="/signup">
            <a style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Sign Up</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
