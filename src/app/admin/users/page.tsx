'use client'

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
    Briefcase
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

interface UserProfile {
    id: string
    full_name: string | null
    role: string
    member_level: string | null
    title: string | null
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
        setIsEditing(true)
    }

    const handleSave = async () => {
        if (!selectedProfile) return

        setIsSaving(true)
        const { success, error } = await updateUserProfile(selectedProfile.id, {
            member_level: editLevel,
            title: editTitle,
            role: editRole
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
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage user levels, titles and system roles.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5 text-primary" />
                                <CardTitle>Registered Users</CardTitle>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                                {profiles.length} Active
                            </Badge>
                        </div>
                        <CardDescription>
                            A list of all users registered in the system and their current statuses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Loading users...</p>
                            </div>
                        ) : profiles.length === 0 ? (
                            <div className="text-center py-12">
                                <User className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                                <p className="text-muted-foreground">No user profiles found. Have they verified their email?</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[100px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {profiles.map((profile) => (
                                            <tr key={profile.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">
                                                    <div className="font-semibold">{profile.full_name || 'Anonymous User'}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">{profile.id.substring(0, 8)}...</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {profile.role === 'admin' ? (
                                                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                                                            <ShieldCheck className="h-3 w-3 mr-1" />
                                                            Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">Member</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-1.5">
                                                        <Trophy className={`h-3 w-3 ${profile.member_level === 'Gold' ? 'text-yellow-500' :
                                                            profile.member_level === 'Silver' ? 'text-slate-400' : 'text-orange-500'
                                                            }`} />
                                                        <span className="font-medium">{profile.member_level || 'Starter'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Briefcase className="h-3 w-3" />
                                                        {profile.title || 'No Title Set'}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(profile)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Rank & Role
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Rank & Role</DialogTitle>
                        <DialogDescription>
                            Modify the level, title, and role for {selectedProfile?.full_name || 'the selected user'}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">User System Role</Label>
                            <Select value={editRole} onValueChange={setEditRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Regular Member</SelectItem>
                                    <SelectItem value="admin" className="text-amber-600 font-bold">System Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="level">Membership Level</Label>
                            <Select value={editLevel} onValueChange={setEditLevel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Starter">Starter</SelectItem>
                                    <SelectItem value="Silver">Silver</SelectItem>
                                    <SelectItem value="Gold">Gold</SelectItem>
                                    <SelectItem value="Elite">Elite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Professional Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Finance Associate, Senior Partner"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
