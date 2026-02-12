import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="current">Current Password</Label>
                        <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new">New Password</Label>
                        <Input id="new" type="password" />
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="notifications">
            <Card>
                 <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Notification settings placeholder...</div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="billing">
            <Card>
                 <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-sm text-muted-foreground">Billing module placeholder...</div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
