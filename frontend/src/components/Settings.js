import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Image, Shield, X, Camera, Check } from 'lucide-react';
import { toast } from 'sonner';

export const Settings = ({ onClose, token }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    currency: 'INR'
  });

  const [notifications, setNotifications] = useState({
    push_enabled: true,
    email_enabled: true,
    daily_summary: true,
    weekly_report: true,
    budget_alert: true,
    fraud_alert: true,
    notification_time: '09:00'
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    app_lock_enabled: false,
    app_lock_pin: '',
    biometric_enabled: false
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
        toast.success('Photo selected!');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveGeneralSettings = () => {
    toast.success('General settings saved!');
  };

  const saveNotifications = () => {
    toast.success('Notification settings saved!');
  };

  const savePhotoSettings = () => {
    if (profilePhoto) {
      toast.success('Profile photo uploaded!');
    } else {
      toast.error('Please select a photo first');
    }
  };

  const saveSecuritySettings = () => {
    if (security.app_lock_enabled && security.app_lock_pin.length !== 4) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }
    toast.success('Security settings saved!');
  };

  return (
    <div className="settings-overlay">
      <Card className="settings-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-purple-600" />
              <CardTitle>Settings</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="setting-group">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(val) => setSettings({...settings, theme: val})}>
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="setting-group">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(val) => setSettings({...settings, language: val})}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="setting-group">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(val) => setSettings({...settings, currency: val})}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={saveGeneralSettings} className="w-full">
                Save Settings
              </Button>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="notification-option">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Get instant alerts</p>
                  </div>
                  <Switch 
                    checked={notifications.push_enabled}
                    onCheckedChange={(val) => setNotifications({...notifications, push_enabled: val})}
                  />
                </div>
              </div>

              <div className="notification-option">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Daily Summary</Label>
                    <p className="text-sm text-gray-600">Daily expense summary</p>
                  </div>
                  <Switch 
                    checked={notifications.daily_summary}
                    onCheckedChange={(val) => setNotifications({...notifications, daily_summary: val})}
                  />
                </div>
              </div>

              <Button onClick={saveNotifications} className="w-full">
                Save Notifications
              </Button>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <div className="photo-upload-section">
                <Label className="font-semibold mb-2">Profile Photo</Label>
                <div className="profile-photo-preview">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="preview-image" />
                  ) : (
                    <div className="no-photo">
                      <Camera className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 mt-2">No photo</p>
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-4"
                />
              </div>

              <Button onClick={savePhotoSettings} className="w-full">
                Upload Photo
              </Button>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="notification-option">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">App Lock (PIN)</Label>
                    <p className="text-sm text-gray-600">4-digit PIN</p>
                  </div>
                  <Switch 
                    checked={security.app_lock_enabled}
                    onCheckedChange={(val) => setSecurity({...security, app_lock_enabled: val})}
                  />
                </div>
              </div>

              {security.app_lock_enabled && (
                <div className="setting-group">
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    value={security.app_lock_pin}
                    onChange={(e) => setSecurity({...security, app_lock_pin: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              )}

              <Button onClick={saveSecuritySettings} className="w-full">
                Save Security
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
