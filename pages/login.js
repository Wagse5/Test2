import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Login
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.ok) {
        router.push('/');
      } else {
        // Handle error
        console.error('Login failed');
      }
    } else {
      // Signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        // Automatically log in after successful signup
        await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        router.push('/');
      } else {
        // Handle error
        console.error('Signup failed');
      }
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
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
