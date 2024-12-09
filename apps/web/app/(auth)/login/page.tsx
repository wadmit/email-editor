'use client'
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { GithubLoginButton } from '@/components/auth/github-login-button';
import { cn } from '@/utils/classname';
import { GoogleLoginButton } from '@/components/auth/google-login-button';
import { EmailLoginForm } from '@/components/auth/email-login-form';


export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:px-0">
     
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[360px]">
          <div className="mb-10 flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Get in,
            </h1>
            <p className="text-muted-foreground text-sm">
              You can continue with your wiseadmit portal credentials.
            </p>
          </div>

          <EmailLoginForm />


        </div>
      </div>
    </div>
  );
}
