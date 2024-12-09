'use client';

import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { emailLoginAction } from '@/actions/auth';
import { catchActionError } from '@/actions/error';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function EmailLoginForm() {
  const loginFormRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const apiCall = async () => {
    try {
      setIsPending(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/signin`, {
        email,
        password,
      });

      const {  accessToken } = response.data;


      toast.success('Magic link has been sent to your email');
      localStorage.setItem('accessToken', accessToken); // Store token if necessary
      router.push('/'); // Redirect after successful login
    } catch (error) {
      toast.error('An error occurred while logging in.');
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex grow flex-col">
      <div>
        <Label className="sr-only" htmlFor="email">
          Email
        </Label>
        <Input
          className="border-gray-300"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="john@example.com"
        />
      </div>

      <div className="mt-2">
        <Label className="sr-only" htmlFor="password">
          Password
        </Label>
        <Input
          className="border-gray-300"
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <button
        className="mt-2 flex h-9 items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
        onClick={apiCall}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Show magic'
        )}
      </button>
    </div>
  );
}
