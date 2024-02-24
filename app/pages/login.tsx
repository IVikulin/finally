import { useRouter } from 'next/router';
import { login } from '@/app/client';
import AuthForm from '@/app/components/AuthForm';


export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    return login({ username, password });
  };

  return (
    <AuthForm
      title="Login"
      submitFunction={handleLogin}
      switchAuthMode={() => router.push('/register')}
      switchText="Don't have an account?"
      switchButtonText="Register"
    />
  );
}
