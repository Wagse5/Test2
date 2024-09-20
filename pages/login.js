import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted:', isLogin ? 'Login' : 'Signup');

    try {
      if (isLogin) {
        // Login logic (unchanged)
      } else {
        // Signup
        console.log('Attempting signup with:', { name, email, password });
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        console.log('Signup response status:', response.status);
        
        const data = await response.json();
        console.log('Signup response data:', data);

        if (response.ok) {
          console.log('Signup successful, attempting auto-login');
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (result.ok) {
            console.log('Auto-login successful, redirecting to home');
            router.push('/');
          } else {
            console.error('Auto-login failed:', result.error);
            setError('Signup successful, but auto-login failed. Please try logging in manually.');
          }
        } else {
          console.error('Signup failed:', data.error);
          setError(data.error || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required={!isLogin}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isLogin ? 'Log in' : 'Sign up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
