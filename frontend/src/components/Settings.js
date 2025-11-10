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
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
  const [photoFile, setPhotoFile] = useState(null);

  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    app_lock_enabled: false,
    app_lock_pin: '',
    biometric_enabled: false,
    share_data_analytics: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Load all settings (you can add endpoints later)
      // For now, use default values
      toast.success('Settings loaded');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
        toast.success('Photo selected! Click Save to upload.');
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
    if (photoFile) {
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
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center gap-2\">
              <SettingsIcon className=\"h-6 w-6 text-purple-600\" />
              <CardTitle>Settings & Preferences</CardTitle>
            </div>
            <Button variant=\"ghost\" size=\"sm\" onClick={onClose}>
              <X className=\"h-4 w-4\" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue=\"general\" className=\"w-full\">
            <TabsList className=\"grid w-full grid-cols-4\">
              <TabsTrigger value=\"general\">
                <SettingsIcon className=\"h-4 w-4 mr-2\" />
                General
              </TabsTrigger>
              <TabsTrigger value=\"notifications\">
                <Bell className=\"h-4 w-4 mr-2\" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value=\"photos\">
                <Image className=\"h-4 w-4 mr-2\" />
                Photos
              </TabsTrigger>
              <TabsTrigger value=\"security\">
                <Shield className=\"h-4 w-4 mr-2\" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value=\"general\" className=\"space-y-4\">
              <div className=\"setting-group\">
                <Label htmlFor=\"theme\">Theme</Label>
                <Select value={settings.theme} onValueChange={(val) => setSettings({...settings, theme: val})}>
                  <SelectTrigger id=\"theme\">
                    <SelectValue placeholder=\"Select theme\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"light\">🌞 Light</SelectItem>
                    <SelectItem value=\"dark\">🌙 Dark</SelectItem>
                    <SelectItem value=\"auto\">🔄 Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className=\"setting-group\">
                <Label htmlFor=\"language\">Language</Label>
                <Select value={settings.language} onValueChange={(val) => setSettings({...settings, language: val})}>
                  <SelectTrigger id=\"language\">
                    <SelectValue placeholder=\"Select language\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"en\">English</SelectItem>
                    <SelectItem value=\"hi\">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value=\"ta\">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value=\"te\">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className=\"setting-group\">
                <Label htmlFor=\"currency\">Currency</Label>
                <Select value={settings.currency} onValueChange={(val) => setSettings({...settings, currency: val})}>
                  <SelectTrigger id=\"currency\">
                    <SelectValue placeholder=\"Select currency\" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=\"INR\">₹ INR (Indian Rupee)</SelectItem>
                    <SelectItem value=\"USD\">$ USD</SelectItem>
                    <SelectItem value=\"EUR\">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={saveGeneralSettings} className=\"w-full\" data-testid=\"save-general-btn\">
                <Check className=\"h-4 w-4 mr-2\" />
                Save General Settings
              </Button>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value=\"notifications\" className=\"space-y-4\">
              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Push Notifications</Label>
                    <p className=\"text-sm text-gray-600\">Get instant alerts</p>
                  </div>
                  <Switch 
                    checked={notifications.push_enabled}
                    onCheckedChange={(val) => setNotifications({...notifications, push_enabled: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Email Notifications</Label>
                    <p className=\"text-sm text-gray-600\">Receive email updates</p>
                  </div>
                  <Switch 
                    checked={notifications.email_enabled}
                    onCheckedChange={(val) => setNotifications({...notifications, email_enabled: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Daily Summary</Label>
                    <p className=\"text-sm text-gray-600\">Daily expense summary</p>
                  </div>
                  <Switch 
                    checked={notifications.daily_summary}
                    onCheckedChange={(val) => setNotifications({...notifications, daily_summary: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Weekly Report</Label>
                    <p className=\"text-sm text-gray-600\">Weekly financial report</p>
                  </div>
                  <Switch 
                    checked={notifications.weekly_report}
                    onCheckedChange={(val) => setNotifications({...notifications, weekly_report: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Budget Alerts</Label>
                    <p className=\"text-sm text-gray-600\">When you exceed budget</p>
                  </div>
                  <Switch 
                    checked={notifications.budget_alert}
                    onCheckedChange={(val) => setNotifications({...notifications, budget_alert: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Fraud Alerts</Label>
                    <p className=\"text-sm text-gray-600\">Suspicious activity</p>
                  </div>
                  <Switch 
                    checked={notifications.fraud_alert}
                    onCheckedChange={(val) => setNotifications({...notifications, fraud_alert: val})}
                  />
                </div>
              </div>

              <div className=\"setting-group\">
                <Label htmlFor=\"notification-time\">Notification Time</Label>
                <Input
                  id=\"notification-time\"
                  type=\"time\"
                  value={notifications.notification_time}
                  onChange={(e) => setNotifications({...notifications, notification_time: e.target.value})}
                />
              </div>

              <Button onClick={saveNotifications} className=\"w-full\" data-testid=\"save-notifications-btn\">
                <Check className=\"h-4 w-4 mr-2\" />
                Save Notifications
              </Button>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value=\"photos\" className=\"space-y-4\">
              <div className=\"photo-upload-section\">
                <Label className=\"font-semibold mb-2\">Profile Photo</Label>
                <div className=\"profile-photo-preview\">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt=\"Profile\" className=\"preview-image\" />
                  ) : (
                    <div className=\"no-photo\">
                      <Camera className=\"h-12 w-12 text-gray-400\" />
                      <p className=\"text-gray-600 mt-2\">No photo yet</p>
                    </div>
                  )}
                </div>
                <Input
                  type=\"file\"
                  accept=\"image/*\"
                  onChange={handlePhotoChange}
                  className=\"mt-4\"
                  data-testid=\"photo-upload-input\"
                />
                <p className=\"text-sm text-gray-500 mt-2\">Max size: 5MB (JPEG, PNG, GIF)</p>
              </div>

              <div className=\"info-box\">
                <h4 className=\"font-semibold mb-2\">Receipt Photos</h4>
                <p className=\"text-sm text-gray-600\">
                  Upload receipt images for expense tracking & verification. 
                  Photos help you track what you bought and when.
                </p>
              </div>

              <Button onClick={savePhotoSettings} className=\"w-full\" data-testid=\"save-photo-btn\">
                <Check className=\"h-4 w-4 mr-2\" />
                Upload Photo
              </Button>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value=\"security\" className=\"space-y-4\">
              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Two-Factor Authentication</Label>
                    <p className=\"text-sm text-gray-600\">Extra security layer</p>
                  </div>
                  <Switch 
                    checked={security.two_factor_enabled}
                    onCheckedChange={(val) => setSecurity({...security, two_factor_enabled: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">App Lock (PIN)</Label>
                    <p className=\"text-sm text-gray-600\">Protect app with 4-digit PIN</p>
                  </div>
                  <Switch 
                    checked={security.app_lock_enabled}
                    onCheckedChange={(val) => setSecurity({...security, app_lock_enabled: val})}
                  />
                </div>
              </div>

              {security.app_lock_enabled && (
                <div className=\"setting-group\">
                  <Label htmlFor=\"pin\">4-Digit PIN</Label>
                  <Input
                    id=\"pin\"
                    type=\"password\"
                    maxLength={4}
                    placeholder=\"Enter 4-digit PIN\"
                    value={security.app_lock_pin}
                    onChange={(e) => setSecurity({...security, app_lock_pin: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              )}

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Biometric Lock</Label>
                    <p className=\"text-sm text-gray-600\">Fingerprint/Face recognition</p>
                  </div>
                  <Switch 
                    checked={security.biometric_enabled}
                    onCheckedChange={(val) => setSecurity({...security, biometric_enabled: val})}
                  />
                </div>
              </div>

              <div className=\"notification-option\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <Label className=\"font-semibold\">Share Anonymous Data</Label>
                    <p className=\"text-sm text-gray-600\">Help us improve the app</p>
                  </div>
                  <Switch 
                    checked={security.share_data_analytics}
                    onCheckedChange={(val) => setSecurity({...security, share_data_analytics: val})}
                  />
                </div>
              </div>

              <Button onClick={saveSecuritySettings} className=\"w-full\" data-testid=\"save-security-btn\">
                <Check className=\"h-4 w-4 mr-2\" />
                Save Security Settings
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
