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
                toast.success("System: Service parameters synchronized.");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Sync Error: Operation failed.");
            }
        } catch (error) {
            toast.error("Critical: Database sync failure.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm("Confirm decommissioning of this service pillar?")) return;

        setIsSaving(true);
        try {
            const updatedAllServices = allServices.filter((_, i) => i !== index);
            const result = await updateServices(updatedAllServices);
            if (result.success) {
                toast.success("System: Service decommissioned.");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Error: Decommission failed.");
            }
        } catch (error) {
            toast.error("Critical Failure: Unexpected end of process.");
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
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl shadow-xl z-20 bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none hover:scale-110 flex items-center justify-center backdrop-blur-md"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] border-slate-800 dark:border-slate-200 bg-slate-900 dark:bg-white rounded-[32px] p-8 lg:p-10 shadow-3xl">
                <DialogHeader className="mb-8">
                    <div className="w-12 h-1 bg-amber-500 mb-6" />
                    <DialogTitle className="text-3xl font-black text-white dark:text-slate-900 tracking-tight">Modify Strategic Pillar</DialogTitle>
                    <DialogDescription className="text-slate-400 dark:text-slate-500 font-medium">
                        Adjust the parameters of your elite service offering.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-8 py-2">
                    <div className="grid gap-3">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Wealth Architecture"
                            className="bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 rounded-xl h-12 text-white dark:text-slate-900 font-bold focus:ring-amber-500"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Narrative</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the strategic impact..."
                            className="min-h-[100px] bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 rounded-xl text-white dark:text-slate-900 font-medium py-3 focus:ring-amber-500"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Core Provisions (One per line)</Label>
                        <Textarea
                            id="features"
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                            className="min-h-[140px] bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 rounded-xl text-white dark:text-slate-900 font-mono text-xs p-4 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between gap-4 mt-12 bg-white/5 dark:bg-black/5 -mx-8 -mb-8 p-8 rounded-b-[32px]">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        disabled={isSaving}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px]"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Decommission
                    </Button>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900" onClick={() => setIsOpen(false)} disabled={isSaving}>
                            Abort
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-8 h-12 font-bold transition-all hover:scale-105 active:scale-95">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sync Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
