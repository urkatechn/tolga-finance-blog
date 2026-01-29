import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function WelcomePage() {
    return (
        <div className="bg-unified flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-blue-100 dark:border-blue-900/30 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    <CardHeader className="text-center pt-8">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
                                <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Verified!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 text-center pb-10">
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Welcome to Tolga Tanagardigil Website.
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your account is now fully active. Join our community of finance professionals.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
                                <Link href="/auth/login">Continue to Sign In</Link>
                            </Button>
                            <Button asChild variant="ghost" className="w-full h-12">
                                <Link href="/">Explore Homepage</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
