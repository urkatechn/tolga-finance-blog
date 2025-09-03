"use client";

import React from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadDialog } from "./image-upload-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MDXEditorToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

interface ToolbarItem {
  icon: React.ReactNode;
  name: string;
  action: () => void;
}

export function MDXEditorToolbar({ textareaRef }: MDXEditorToolbarProps) {
  const handleImageInsert = (imageUrl: string, altText: string) => {
    insertText(`![${altText}](${imageUrl})`);
  };

  const insertText = (before: string, after = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + after;
    
    textarea.focus();
    document.execCommand("insertText", false, newText);
  };

  const insertHeading = (level: number) => {
    const prefix = "#".repeat(level) + " ";
    insertText(prefix);
  };

  const toolbarItems: ToolbarItem[] = [
    {
      icon: <Bold className="h-4 w-4" />,
      name: "Bold",
      action: () => insertText("**", "**"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      name: "Italic",
      action: () => insertText("*", "*"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      name: "Heading 1",
      action: () => insertHeading(1),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      name: "Heading 2",
      action: () => insertHeading(2),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      name: "Heading 3",
      action: () => insertHeading(3),
    },
    {
      icon: <List className="h-4 w-4" />,
      name: "Bullet List",
      action: () => insertText("- "),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      name: "Numbered List",
      action: () => insertText("1. "),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      name: "Quote",
      action: () => insertText("> "),
    },
    {
      icon: <Code className="h-4 w-4" />,
      name: "Code Block",
      action: () => insertText("```\n", "\n```"),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      name: "Link",
      action: () => insertText("[", "](url)"),
    },
    // Image button is handled separately with the dialog

  ];

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 rounded-md border bg-background p-1">
        {toolbarItems.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  item.action();
                }}
                aria-label={item.name}
              >
                {item.icon}
                <span className="sr-only">{item.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{item.name}</TooltipContent>
          </Tooltip>
        ))}
        
        {/* Image upload dialog */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ImageUploadDialog onImageInsert={handleImageInsert}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Insert Image"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Insert Image</span>
                </Button>
              </ImageUploadDialog>
            </span>
          </TooltipTrigger>
          <TooltipContent>Insert Image</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
