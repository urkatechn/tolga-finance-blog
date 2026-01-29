import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg border-red-100 dark:border-red-900/30">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                            Authentication Error
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                            Something went wrong while confirming your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                            <p>
                                This usually happens if:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The confirmation link has expired.</li>
                                <li>The link has already been used.</li>
                                <li>There was a temporary connection issue.</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-500">
                                <Link href="/auth/login">Try Signing In</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/auth/register">Create a New Account</Link>
                            </Button>
                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/">Return to Homepage</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
