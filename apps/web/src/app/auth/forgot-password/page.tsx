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

export default function ForgotPasswordPage() {
  return (
    <form
      action=""
      className="flex min-h-screen w-[550px] items-center justify-center"
    >
      <Card className="w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-slate-900">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
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
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-between gap-2">
          <Button type="submit" className="ml-auto w-full">
            Recover password
          </Button>

          <Separator className="my-2" />

          <Button variant="link" className="ml-auto w-full" size="sm" asChild>
            <Link href="/auth/sign-in">Sign in instead</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
