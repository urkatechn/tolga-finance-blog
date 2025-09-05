"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Archive } from 'lucide-react'

interface Post {
  id: string
  title: string
  status: string
}

interface BulkArchiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPosts: Post[]
  onConfirm: () => void
  isArchiving?: boolean
  isArchive: boolean // true for archive, false for unarchive
}

export function BulkArchiveDialog({ 
  open, 
  onOpenChange, 
  selectedPosts, 
  onConfirm,
  isArchiving = false,
  isArchive
}: BulkArchiveDialogProps) {
  const postCount = selectedPosts.length

  if (postCount === 0) return null

  const action = isArchive ? 'archive' : 'unarchive'
  const actionTitle = isArchive ? 'Archive' : 'Unarchive'

  const getPostStatusSummary = () => {
    const statusCounts = selectedPosts.reduce((acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const summaryParts = Object.entries(statusCounts).map(([status, count]) => {
      return `${count} ${status}${count > 1 ? '' : ''}`
    })

    return summaryParts.join(', ')
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Archive className="h-5 w-5 text-orange-600" />
            </div>
            <AlertDialogTitle>{actionTitle} {postCount} Post{postCount !== 1 ? 's' : ''}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to {action} {postCount} post{postCount !== 1 ? 's' : ''}? 
            This includes {getPostStatusSummary()}.
            <br /><br />
            {isArchive ? (
              <>
                <strong>Archived posts will be hidden from the public.</strong> You can unarchive them later if needed.
              </>
            ) : (
              <>
                <strong>Unarchived posts will be saved as drafts.</strong> You can then publish them again if needed.
              </>
            )}
            {selectedPosts.length <= 5 && (
              <>
                <br /><br />
                <span className="text-sm font-medium">Posts to be {action}d:</span>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                  {selectedPosts.map((post) => (
                    <li key={post.id} className="truncate">
                      {post.title} <span className="text-muted-foreground">({post.status})</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isArchiving}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            {isArchiving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {actionTitle.slice(0, -1)}ing {postCount} Post{postCount !== 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                {actionTitle} {postCount} Post{postCount !== 1 ? 's' : ''}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
