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

interface Author {
  id: string
  name: string
  email: string | null
  bio: string | null
  is_default: boolean
}

interface DeleteAuthorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author: Author | null
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteAuthorDialog({ 
  open, 
  onOpenChange, 
  author, 
  onConfirm,
  isDeleting = false
}: DeleteAuthorDialogProps) {
  if (!author) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Author?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete &quot;{author.name}&quot;?
            <br /><br />
            <strong>This action cannot be undone.</strong> The author profile will be permanently removed.
            {author.email && (
              <>
                <br /><br />
                <span className="text-sm font-medium">Author details:</span>
                <div className="mt-2 rounded-lg bg-muted/50 p-3">
                  <div className="font-medium">{author.name}</div>
                  <div className="text-sm text-muted-foreground">{author.email}</div>
                  {author.bio && (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {author.bio}
                    </div>
                  )}
                  {author.is_default && (
                    <div className="text-xs text-orange-600 font-medium mt-1">
                      ⚠ This is the default author
                    </div>
                  )}
                </div>
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
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Author
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
