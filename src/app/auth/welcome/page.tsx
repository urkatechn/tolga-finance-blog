import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function WelcomePage() {
    return (
        <div className="bg-unified flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-slate-200 dark:border-slate-800/30 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-slate-700 to-slate-900" />
                    <CardHeader className="text-center pt-8">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-slate-100 dark:bg-slate-900/40 p-3 ring-8 ring-slate-100/50 dark:ring-slate-900/20">
                                <CheckCircle className="h-10 w-10 text-slate-800 dark:text-slate-200" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
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
                            <Button asChild size="lg" className="w-full bg-primary hover:opacity-90 text-white font-bold h-12">
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
