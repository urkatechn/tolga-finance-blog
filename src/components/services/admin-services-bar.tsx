"use client";

import { useState } from "react";
import { Plus, Layout, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateServices } from "@/app/services/actions";

export function AdminServicesBar({ services }: { services: any[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleAddService = async () => {
        if (!title || !description) {
            toast.error("Please fill in title and description");
            return;
        }

        setIsSaving(true);
        try {
            const newService = {
                title,
                description,
                features: [],
                icon_name: "Briefcase"
            };

            const updatedServices = [newService, ...services];
            const result = await updateServices(updatedServices);

            if (result.success) {
                toast.success("New service added");
                setIsAdding(false);
                setTitle("");
                setDescription("");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to add service");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-3 rounded-2xl bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 px-3 border-r border-slate-700 dark:border-slate-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Services Admin</span>
            </div>

            <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        className="bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Create a new service offering for your clients.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-title">Service Title</Label>
                            <Input
                                id="new-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Consultancy, Audit, etc."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-desc">Description</Label>
                            <Textarea
                                id="new-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this service about?"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button onClick={handleAddService} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
