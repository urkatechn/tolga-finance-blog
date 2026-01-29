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
            toast.error("Management: Please define service parameters.");
            return;
        }

        setIsSaving(true);
        try {
            const newService = {
                title,
                description,
                features: ["New Strategic Pillar"],
                icon_name: "Briefcase"
            };

            const updatedServices = [newService, ...services];
            const result = await updateServices(updatedServices);

            if (result.success) {
                toast.success("System: New service provisioned.");
                setIsAdding(false);
                setTitle("");
                setDescription("");
                router.refresh();
            } else {
                toast.error(result.error || "Execution Error: Failed to add service.");
            }
        } catch (error) {
            toast.error("Critical Failure: Unexpected system state.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-2 rounded-[24px] bg-slate-900/80 dark:bg-white/80 backdrop-blur-2xl border border-slate-700/50 dark:border-slate-200/50 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-700/50 dark:border-slate-200/50">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
                </div>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Add Services</span>
            </div>

            <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 text-white dark:text-slate-900 border border-white/10 dark:border-slate-900/10 rounded-2xl px-6 h-10 font-bold transition-all hover:scale-105"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Provision
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] border-slate-800 dark:border-slate-200 bg-slate-900 dark:bg-white rounded-[32px] p-8 shadow-3xl">
                    <DialogHeader className="mb-8">
                        <div className="w-12 h-1 bg-blue-500 mb-6" />
                        <DialogTitle className="text-3xl font-black text-white dark:text-slate-900 tracking-tight">Provision New Service</DialogTitle>
                        <DialogDescription className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            Define the parameters for a new strategic service offering.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="new-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Identifier</Label>
                            <Input
                                id="new-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Tactical M&A Advisory"
                                className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 rounded-xl h-12 text-white dark:text-slate-900 focus:ring-blue-500 font-bold placeholder:text-slate-600 dark:placeholder:text-slate-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-desc" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mission Description</Label>
                            <Textarea
                                id="new-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detail the strategic value..."
                                className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 rounded-xl min-h-[120px] text-white dark:text-slate-900 focus:ring-blue-500 font-medium py-4 placeholder:text-slate-600 dark:placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-10 gap-3">
                        <Button variant="ghost" className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900" onClick={() => setIsAdding(false)}>Abort</Button>
                        <Button
                            onClick={handleAddService}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-12 font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initiate Provision"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
