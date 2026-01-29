import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Users as UsersIcon,
    ShieldCheck,
    User,
    MoreVertical,
    Pencil,
    Loader2,
    Trophy,
    Briefcase,
    Star
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getUserProfiles, updateUserProfile } from './actions'
import { toast } from 'sonner'
import { StarRating } from '@/components/ui/star-rating'

interface UserProfile {
    id: string
    full_name: string | null
    role: string
    member_level: string | null
    title: string | null
    member_rank: number | null
    created_at: string
}

export default function UsersPage() {
    const [profiles, setProfiles] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

    // Edit Form State
    const [editLevel, setEditLevel] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editRole, setEditRole] = useState('')
    const [editRank, setEditRank] = useState(1)
    const [isSaving, setIsSaving] = useState(false)

    const fetchProfiles = async () => {
        setIsLoading(true)
        const data = await getUserProfiles()
        setProfiles(data as UserProfile[])
        setIsLoading(false)
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    const handleEdit = (profile: UserProfile) => {
        setSelectedProfile(profile)
        setEditLevel(profile.member_level || 'Starter')
        setEditTitle(profile.title || '')
        setEditRole(profile.role)
        setEditRank(profile.member_rank || 1)
        setIsEditing(true)
    }

    const handleSave = async () => {
        if (!selectedProfile) return

        setIsSaving(true)
        const { success, error } = await updateUserProfile(selectedProfile.id, {
            member_level: editLevel,
            title: editTitle,
            role: editRole,
            member_rank: editRank
        })

        if (success) {
            toast.success('User profile updated successfully')
            setIsEditing(false)
            fetchProfiles()
        } else {
            toast.error('Failed to update profile')
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-muted-foreground font-medium">Manage user levels, operational titles, and strategic ranks.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="shadow-2xl border-slate-200/50 dark:border-slate-800/50 overflow-hidden rounded-[32px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
                    <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl">
                                    <UsersIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black tracking-tight">Registered Assets</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">All strategic partners registered within the system.</CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary" className="font-black bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                                {profiles.length} Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Syncing database...</p>
                            </div>
                        ) : profiles.length === 0 ? (
                            <div className="text-center py-20">
                                <User className="h-16 w-16 mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                                <p className="text-slate-500 font-bold">No active profiles identified.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                            <th className="h-14 px-8 text-left align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">User Identity</th>
                                            <th className="h-14 px-8 text-left align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">System Role</th>
                                            <th className="h-14 px-8 text-left align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Pillar Level</th>
                                            <th className="h-14 px-8 text-left align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Strategic Rank</th>
                                            <th className="h-14 px-8 text-left align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Title</th>
                                            <th className="h-14 px-8 text-right align-middle font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {profiles.map((profile) => (
                                            <tr key={profile.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-8 align-middle">
                                                    <div className="font-black text-slate-900 dark:text-white mb-1">{profile.full_name || 'Anonymous User'}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{profile.id}</div>
                                                </td>
                                                <td className="p-8 align-middle">
                                                    {profile.role === 'admin' ? (
                                                        <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-lg">
                                                            <ShieldCheck className="h-3 w-3 mr-1.5" />
                                                            System Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-slate-800 font-bold text-[10px] px-3 py-1 uppercase tracking-widest">
                                                            Pillar Member
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="p-8 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className={`h-4 w-4 ${profile.member_level === 'Gold' ? 'text-yellow-500' :
                                                            profile.member_level === 'Silver' ? 'text-slate-400' : 'text-orange-500'
                                                            }`} />
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{profile.member_level || 'Starter'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 align-middle">
                                                    <StarRating rank={profile.member_rank || 1} />
                                                </td>
                                                <td className="p-8 align-middle">
                                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                        <Briefcase className="h-3.5 w-3.5 opacity-40" />
                                                        {profile.title || 'Undeclared'}
                                                    </div>
                                                </td>
                                                <td className="p-8 align-middle text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="p-2 bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-200 rounded-[20px] shadow-3xl min-w-[200px]">
                                                            <DropdownMenuItem
                                                                onClick={() => handleEdit(profile)}
                                                                className="rounded-xl h-11 px-4 cursor-pointer text-slate-300 dark:text-slate-700 focus:bg-white/10 dark:focus:bg-slate-100"
                                                            >
                                                                <Pencil className="mr-3 h-4 w-4" />
                                                                <span className="font-bold">Modify Status</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 rounded-[40px] p-10 shadow-3xl text-white">
                    <DialogHeader>
                        <div className="w-12 h-1 bg-yellow-500 mb-8" />
                        <DialogTitle className="text-3xl font-black tracking-tight">Modify Asset Class</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium pt-2">
                            Adjusting the operational parameters for <span className="text-white font-bold">{selectedProfile?.full_name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-8 py-8">
                        <div className="grid gap-3">
                            <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">System Role</Label>
                            <Select value={editRole} onValueChange={setEditRole}>
                                <SelectTrigger className="h-12 bg-white/5 border-slate-800 rounded-xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 rounded-2xl">
                                    <SelectItem value="member" className="font-bold text-slate-300">Pillar Member</SelectItem>
                                    <SelectItem value="admin" className="font-black text-amber-500">System Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="level" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Membership Level</Label>
                            <Select value={editLevel} onValueChange={setEditLevel}>
                                <SelectTrigger className="h-12 bg-white/5 border-slate-800 rounded-xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 rounded-2xl">
                                    <SelectItem value="Starter" className="font-bold">Starter</SelectItem>
                                    <SelectItem value="Silver" className="font-bold text-slate-400">Silver</SelectItem>
                                    <SelectItem value="Gold" className="font-bold text-yellow-500">Gold</SelectItem>
                                    <SelectItem value="Elite" className="font-black text-blue-400">Elite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Strategic Rank (Stars)</Label>
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-slate-800/50">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setEditRank(star)}
                                        className="transition-all hover:scale-125 hover:brightness-125"
                                    >
                                        <Star
                                            size={24}
                                            className={`${star <= editRank
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-slate-700"
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-auto text-xs font-black text-slate-500 uppercase tracking-widest">{editRank} / 5</span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Operational Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Finance Associate, Senior Partner"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="h-12 bg-white/5 border-slate-800 rounded-xl font-bold placeholder:text-slate-700"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-12 text-slate-400 hover:text-white rounded-xl font-bold">Abort</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="h-12 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest px-10 shadow-xl transition-all hover:scale-105 active:scale-95">
                            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
