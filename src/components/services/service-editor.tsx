"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateServices } from "@/app/services/actions";

interface Service {
    title: string;
    description: string;
    features: string[];
    icon_name: string;
}

interface ServiceEditorProps {
    service: Service;
    index: number;
    allServices: Service[];
}

export function ServiceEditor({ service, index, allServices }: ServiceEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(service.title);
    const [description, setDescription] = useState(service.description);
    const [features, setFeatures] = useState(service.features?.join("\n") || "");
    const [iconName, setIconName] = useState(service.icon_name || "Briefcase");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedService = {
                ...service,
                title,
                description,
                features: features.split("\n").filter(f => f.trim() !== ""),
                icon_name: iconName
            };

            const updatedAllServices = [...allServices];
            updatedAllServices[index] = updatedService;

            const result = await updateServices(updatedAllServices);
            if (result.success) {
                toast.success("Service updated successfully");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update service");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this service?")) return;

        setIsSaving(true);
        try {
            const updatedAllServices = allServices.filter((_, i) => i !== index);
            const result = await updateServices(updatedAllServices);
            if (result.success) {
                toast.success("Service removed successfully");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to remove service");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg z-20 bg-white/90 dark:bg-slate-800/90 hover:scale-110"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Service</DialogTitle>
                    <DialogDescription>
                        Modify the details of your service below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-sm font-semibold">Service Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Financial Advisory"
                            className="bg-slate-50 dark:bg-slate-800/50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe what you offer..."
                            className="min-h-[100px] bg-slate-50 dark:bg-slate-800/50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="features" className="text-sm font-semibold">Features (One per line)</Label>
                        <Textarea
                            id="features"
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 font-mono text-xs"
                        />
                    </div>
                </div>
                <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isSaving}
                        className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border-none shadow-none"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
