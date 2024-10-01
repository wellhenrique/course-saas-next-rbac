import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <Button className="bg-primary" variant="link" size="sm" asChild>
      <Link href={'/auth/sign-in'} className="text-gray-600">
        SignIn
      </Link>
    </Button>
  )
}
