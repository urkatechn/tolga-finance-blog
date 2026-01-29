"use client";

import React, { useState, useEffect } from 'react';
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    GripVertical,
    Video,
    Info,
    CheckCircle2,
    BarChart3,
    Target,
    LineChart,
    ShieldCheck,
    Users2,
    Briefcase,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { useSettings } from '@/contexts/settings-context';
import { PageSkeleton } from "@/components/admin/sidebar-skeleton";

const AVAILABLE_ICONS = [
    { name: "BarChart3", icon: BarChart3 },
    { name: "Target", icon: Target },
    { name: "LineChart", icon: LineChart },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "Users2", icon: Users2 },
    { name: "Briefcase", icon: Briefcase },
    { name: "Zap", icon: Zap },
    { name: "Video", icon: Video },
];

export default function ServicesSettingsPage() {
    const { settings, loading, refreshSettings } = useSettings();
    const { toast } = useToast();

    const [saving, setSaving] = useState(false);
    const [googleMeetUrl, setGoogleMeetUrl] = useState('');
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        if (settings) {
            setGoogleMeetUrl(settings.google_meet_url || '');
            try {
                setServices(JSON.parse(settings.services_json || '[]'));
            } catch (e) {
                console.error("Failed to parse services_json", e);
                setServices([]);
            }
        }
    }, [settings]);

    const handleAddService = () => {
        const newService = {
            title: "New Service",
            description: "Service description goes here.",
            features: ["Feature 1"],
            icon_name: "Briefcase"
        };
        setServices([...services, newService]);
    };

    const handleRemoveService = (index: number) => {
        const newServices = [...services];
        newServices.splice(index, 1);
        setServices(newServices);
    };

    const handleServiceChange = (index: number, field: string, value: any) => {
        const newServices = [...services];
        newServices[index] = { ...newServices[index], [field]: value };
        setServices(newServices);
    };

    const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
        const newServices = [...services];
        const newFeatures = [...newServices[serviceIndex].features];
        newFeatures[featureIndex] = value;
        newServices[serviceIndex].features = newFeatures;
        setServices(newServices);
    };

    const handleAddFeature = (serviceIndex: number) => {
        const newServices = [...services];
        newServices[serviceIndex].features = [...newServices[serviceIndex].features, "New Feature"];
        setServices(newServices);
    };

    const handleRemoveFeature = (serviceIndex: number, featureIndex: number) => {
        const newServices = [...services];
        const newFeatures = [...newServices[serviceIndex].features];
        newFeatures.splice(featureIndex, 1);
        newServices[serviceIndex].features = newFeatures;
        setServices(newServices);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    settings: {
                        services_json: JSON.stringify(services),
                        google_meet_url: googleMeetUrl
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save settings');
            }

            await refreshSettings();
            toast({
                title: "Success",
                description: "Services settings updated successfully!",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageSkeleton />;

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services & Bookings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your professional offerings and conference links.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Separator />

            {/* Google Meet Section */}
            <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Video className="w-5 h-5" />
                        Meeting Configuration
                    </CardTitle>
                    <CardDescription>
                        This link will be provided to clients after they submit a booking request.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="google_meet_url">Google Meet / Zoom URL</Label>
                        <Input
                            id="google_meet_url"
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            value={googleMeetUrl}
                            onChange={(e) => setGoogleMeetUrl(e.target.value)}
                            className="bg-white border-blue-200"
                        />
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Tip: Use your personal room link or a recurring meeting link.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Services List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Offerings & Methodology</h2>
                    <Button variant="outline" size="sm" onClick={handleAddService} className="h-9">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            {AVAILABLE_ICONS.find(i => i.name === service.icon_name)?.icon({ className: "w-5 h-5 text-blue-600" }) || <Briefcase className="w-5 h-5" />}
                                        </div>
                                        <CardTitle className="text-lg">Service #{index + 1}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveService(index)} className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Service Title</Label>
                                            <Input
                                                value={service.title}
                                                onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                                                placeholder="e.g. Financial Planning"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Icon</Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {AVAILABLE_ICONS.map((icon) => (
                                                    <Button
                                                        key={icon.name}
                                                        variant={service.icon_name === icon.name ? "default" : "outline"}
                                                        size="sm"
                                                        className="h-10 p-0"
                                                        onClick={() => handleServiceChange(index, 'icon_name', icon.name)}
                                                    >
                                                        <icon.icon className="w-4 h-4" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Description</Label>
                                        <Textarea
                                            value={service.description}
                                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                            placeholder="What does this service entail?"
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">Key Features / Modules</Label>
                                        <Button variant="ghost" size="sm" onClick={() => handleAddFeature(index)} className="h-7 text-xs">
                                            <Plus className="w-3 h-3 mr-1" /> Add Feature
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(service.features || []).map((feature: string, fIndex: number) => (
                                            <div key={fIndex} className="flex items-center gap-2">
                                                <Input
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, fIndex, e.target.value)}
                                                    className="h-9 text-sm"
                                                />
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(index, fIndex)} className="h-9 w-9 text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {services.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-3xl border-slate-200">
                    <p className="text-muted-foreground">No services defined. Click "Add Service" to get started.</p>
                </div>
            )}

            <div className="flex justify-end pt-6">
                <Button onClick={handleSave} disabled={saving} size="lg" className="px-12">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Changes
                </Button>
            </div>
        </div>
    );
}
