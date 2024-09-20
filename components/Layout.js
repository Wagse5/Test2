import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Head>
        <title>Sentiment Todo App</title>
        <meta name="description" content="A todo app with sentiment analysis" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header style={{ 
        backgroundColor: '#ffffff', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        padding: '1rem',
        borderRadius: '0 0 15px 15px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          '@media (min-width: 768px)': {
            flexDirection: 'row',
            justifyContent: 'space-between',
          }
        }}>
          <h1 style={{ margin: '0 0 1rem 0', color: '#4a4a4a', fontSize: '2rem', '@media (min-width: 768px)': { margin: 0 } }}>Sentiment Todo App</h1>
          {session && (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', '@media (min-width: 768px)': { flexDirection: 'row' } }}>
              <p style={{ margin: '0 0 1rem 0', color: '#4a4a4a', fontSize: '1.2rem', fontWeight: 'bold', '@media (min-width: 768px)': { margin: '0 1rem 0 0' } }}>Welcome, {session.user.name || session.user.email}</p>
              <button 
                onClick={handleSignOut} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.3s'
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main style={{ 
        flex: 1,
        width: '100%',
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '1rem', 
        backgroundColor: '#ffffff', 
        color: '#4a4a4a',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p>© 2023 Sentiment Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
}
