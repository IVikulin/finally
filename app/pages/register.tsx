import { useRouter } from 'next/router';
import { register } from '@/app/client';
import AuthForm from '@/app/components/AuthForm';


export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (username: string, password: string) => {
    return register({ username, password });
  };

  return (
    <AuthForm
      title="Register"
      submitFunction={handleRegister}
      switchAuthMode={() => router.push('/login')}
      switchText="Already have an account?"
      switchButtonText="Login"
    />
  );
}
