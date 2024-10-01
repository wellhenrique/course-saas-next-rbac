'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle, Loader2 } from 'lucide-react'

import githubIcon from '@/assets/github-icon.svg'

import { useFormState } from '@/hooks/use-form-state'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { signInWithEmailAndPassword } from '../actions'
import { signInWithGithub } from '../../actions'

export function SignInForm() {
  const [formState, handleSignIn, isPending] = useFormState(
    signInWithEmailAndPassword,
  )

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSignIn}
        className="flex w-[550px] flex-col items-center justify-center"
      >
        <Card className="w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-slate-900">
          {formState.success === false && formState.message && (
            <Alert variant="destructive" className="mb-3 w-full">
              <AlertTriangle className="size-4" />
              <AlertTitle>Sign in failed!</AlertTitle>
              <AlertDescription>
                <p>{formState.message}</p>
              </AlertDescription>
            </Alert>
          )}

          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" id="email" />

              {formState.errors?.email && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {formState.errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" id="password" />
              {formState.errors?.password && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {formState.errors.password}
                </p>
              )}
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-foreground hover:underline"
            >
              Forgot your password?
            </Link>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-between">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-3 size-4 animate-spin" />}
              Sign in with e-mail
            </Button>

            <Separator className="my-2" />

            <Button className="w-full" variant="link" size="sm" asChild>
              <Link href="/auth/sign-up">Create new account</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>

      <form
        action={signInWithGithub}
        className="mx-auto flex w-[350px] flex-col items-center justify-center"
      >
        <Button type="submit" className="w-full" variant="outline">
          <Image alt="" src={githubIcon} className="mr-2 size-4 dark:invert" />
          Sign in with GitHub
        </Button>
      </form>
    </div>
  )
}
