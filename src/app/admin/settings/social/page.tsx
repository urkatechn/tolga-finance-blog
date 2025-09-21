"use client";

import React, { useState } from "react";
import { Save, Loader2, Link as LinkIcon, AtSign, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";

export default function SocialSettingsPage() {
  const { settings, loading, refreshSettings } = useSettings();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    social_linkedin: settings?.social_linkedin || "",
    social_twitter: settings?.social_twitter || "",
    social_github: settings?.social_github || "",
    social_email: settings?.social_email || "",
  });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        social_linkedin: settings.social_linkedin || "",
        social_twitter: settings.social_twitter || "",
        social_github: settings.social_github || "",
        social_email: settings.social_email || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: formData }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save social settings");
      }

      toast({ title: "Success", description: "Social settings saved." });
      await refreshSettings();
    } catch (error) {
      console.error("Error saving social settings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save social settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Settings</h1>
          <p className="text-muted-foreground">Manage your public social links used across the site.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">Profiles</CardTitle>
          <CardDescription className="text-base">These appear in header/footer and contact sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="social_linkedin">LinkedIn URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="social_linkedin"
                  placeholder="https://www.linkedin.com/in/username"
                  value={formData.social_linkedin}
                  onChange={(e) => setFormData((p) => ({ ...p, social_linkedin: e.target.value }))}
                />
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_twitter">Twitter/X Handle or URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="social_twitter"
                  placeholder="@yourhandle or https://twitter.com/yourhandle"
                  value={formData.social_twitter}
                  onChange={(e) => setFormData((p) => ({ ...p, social_twitter: e.target.value }))}
                />
                <AtSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Either @handle or full URL is accepted.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_github">GitHub URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="social_github"
                  placeholder="https://github.com/username"
                  value={formData.social_github}
                  onChange={(e) => setFormData((p) => ({ ...p, social_github: e.target.value }))}
                />
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_email">Public Contact Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="social_email"
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.social_email}
                  onChange={(e) => setFormData((p) => ({ ...p, social_email: e.target.value }))}
                />
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

