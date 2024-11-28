'use server';

import { z } from 'zod'; '@/lib/supabase/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const emailLoginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Please provide a password'),
});

export async function emailLoginAction(formData: FormData) {
  const result = emailLoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      data: null,
      error: {
        message: result.error.issues.map((issue) => issue.message).join(', '),
        code: 'validation_error',
        errors: result.error.issues.map((issue) => issue.message),
      },
    };
  }

  const { email, password } = result.data;

  try {
    const response = await axios.post(
      'https://api-dev.wiseadmit.io/api/v1/dashboard/auth/signin',
      { email, password }
    );
    cookies().set('accessToken', response.data.accessToken)
    return {
      error: null,
      data: response.data.accessToken,
    };
  } catch (error) {
    return {
      error: {
        message: 'Failed to login',
      },
      data: null
    };
  }

}


