import Image from 'next/image'
import Link from 'next/link'

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

import githubIcon from '@/assets/github-icon.svg'

export default function SignUpPage() {
  return (
    <form
      action=""
      className="flex min-h-screen w-[550px] items-center justify-center"
    >
      <Card className="w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-slate-900">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="your name"
              className="placeholder:opacity-45"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="placeholder:opacity-45"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="**********"
              className="placeholder:opacity-45"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm your password</Label>
            <Input
              id="password_confirmation"
              type="password_confirmation"
              placeholder="**********"
              className="placeholder:opacity-45"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-between gap-2">
          <Button type="submit" className="ml-auto w-full">
            Create account
          </Button>

          <Separator className="my-2" />

          <Button variant="outline" type="submit" className="ml-auto w-full">
            <Image
              className="mr-2 size-4 dark:invert"
              src={githubIcon}
              alt=""
            />
            Sign up with github
          </Button>

          <Button variant="link" className="ml-auto w-full" size="sm" asChild>
            <Link href="/auth/sign-in">Already registered Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
