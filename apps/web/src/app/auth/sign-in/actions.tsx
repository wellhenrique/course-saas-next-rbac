'use server'
import { z } from 'zod'
import { HTTPError } from 'ky'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
})

export async function signInWithEmailAndPassword(form: FormData) {
  const parse = signInSchema.safeParse(Object.fromEntries(form))

  if (!parse.success) {
    const error = parse.error.flatten().fieldErrors
    return {
      success: false,
      message: null,
      errors: error,
    }
  }

  const { email, password } = parse.data

  try {
    const { token } = await signInWithPassword({
      email: String(email),
      password: String(password),
    })

    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message: message as string, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  redirect('/')
}
