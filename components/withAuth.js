import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    if (!session) {
      router.replace('/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
