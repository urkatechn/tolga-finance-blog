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
import { Trash2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  status: string
}

interface BulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPosts: Post[]
  onConfirm: () => void
  isDeleting?: boolean
}

export function BulkDeleteDialog({ 
  open, 
  onOpenChange, 
  selectedPosts, 
  onConfirm,
  isDeleting = false
}: BulkDeleteDialogProps) {
  const postCount = selectedPosts.length

  if (postCount === 0) return null

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete {postCount} Post{postCount !== 1 ? 's' : ''}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete {postCount} post{postCount !== 1 ? 's' : ''}? 
            This includes {getPostStatusSummary()}.
            <br /><br />
            <strong>This action cannot be undone.</strong> All selected posts and their content will be permanently removed.
            {selectedPosts.length <= 5 && (
              <>
                <br /><br />
                <span className="text-sm font-medium">Posts to be deleted:</span>
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
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting {postCount} Post{postCount !== 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {postCount} Post{postCount !== 1 ? 's' : ''}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
