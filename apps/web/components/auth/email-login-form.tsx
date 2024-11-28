'use client';

import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { emailLoginAction } from '@/actions/auth';
import { catchActionError } from '@/actions/error';
import { useServerAction } from '@/utils/use-server-action';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { redirect, useRouter } from 'next/navigation';


export function EmailLoginForm() {
  const loginFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter()

  const [action, isPending] = useServerAction(
    catchActionError(emailLoginAction),
    (result) => {
      const { error,data  } = result!;
      localStorage.setItem('accessToken',data)
      if (error) {
        toast.error(error.message || 'Something went wrong');
        return;
      }
 
      toast.success('Magic link has been sent to your email');
      router.push("/")
    }
  );

  return (
    // @ts-ignore
    <form action={action} className="flex grow flex-col" ref={loginFormRef}>
      <div>
        <Label className="sr-only" htmlFor="email">
          Email
        </Label>
        <Input
          className="border-gray-300"
          id="email"
          name="email"
          placeholder="john@example.com"
        />
      </div>

      <div className='mt-2'>
        <Label className="sr-only" htmlFor="password">
          Password
        </Label>
        <Input
          className="border-gray-300"
          id="password"
          name="password"
          type='password'
        />
      </div>
      <button
        className="mt-2 flex h-9 items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Send magic link'
        )}
      </button>
    </form>
  );
}
