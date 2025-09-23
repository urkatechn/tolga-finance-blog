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
import { Trash2, MessageCircle } from 'lucide-react'

interface Comment {
  id: string
  author_name: string
  content: string
  parent_id?: string
}

interface DeleteCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteCommentDialog({ 
  open, 
  onOpenChange, 
  comment, 
  onConfirm,
  isDeleting = false
}: DeleteCommentDialogProps) {
  if (!comment) return null

  const isReply = !!comment.parent_id
  const commentType = isReply ? 'reply' : 'comment'

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              {isReply ? (
                <MessageCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Trash2 className="h-5 w-5 text-destructive" />
              )}
            </div>
            <AlertDialogTitle>Delete {isReply ? 'Reply' : 'Comment'}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this {commentType} by <strong>{comment.author_name}</strong>?
          </AlertDialogDescription>
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-muted rounded-md text-sm italic">
              &quot;{comment.content.length > 100 ? comment.content.substring(0, 100) + '...' : comment.content}&quot;
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>This action cannot be undone.</strong> The {commentType} will be permanently removed.
            </p>
          </div>
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
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {isReply ? 'Reply' : 'Comment'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}