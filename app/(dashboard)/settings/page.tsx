"use client";

import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OAuthStatus } from "@/components/settings/OAuthStatus";
import { ScopesList } from "@/components/settings/ScopesList";
import { DisconnectButton } from "@/components/settings/DisconnectButton";

export default function SettingsPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="oauth" className="space-y-4">
          <TabsList>
            <TabsTrigger value="oauth">OAuth & Permissions</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="oauth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Account Connection</CardTitle>
                <CardDescription>
                  Manage your Google account connection and OAuth permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <OAuthStatus />
                <ScopesList />
                <div className="pt-4 border-t">
                  <DisconnectButton />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize your AURA experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Preferences settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About AURA</CardTitle>
                <CardDescription>Version and system information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Version</span>
                    <span className="text-muted-foreground">1.0.0</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">UserID</span>
                    <span className="text-muted-foreground">{user.id}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Email</span>
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
