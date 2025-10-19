'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Settings, 
  Save, 
  Bell, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Printer,
  CreditCard,
  Globe,
  Shield,
  Palette
} from 'lucide-react'

interface VendorSettings {
  shopName: string
  email: string
  phone: string
  address: string
  businessHours: {
    open: string
    close: string
    days: string[]
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    sound: boolean
  }
  printing: {
    defaultPaperSize: string
    defaultQuality: string
    autoAcceptOrders: boolean
    maxOrdersPerHour: number
  }
  payment: {
    acceptedMethods: string[]
    autoConfirmPayment: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    currency: string
  }
}

export function SettingsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useState<VendorSettings>({
    shopName: 'Rajesh Print Shop',
    email: 'rajesh@sec128.jprint.com',
    phone: '+91 98765 43210',
    address: 'SEC-128, Main Building, Room 101',
    businessHours: {
      open: '09:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      sound: true
    },
    printing: {
      defaultPaperSize: 'A4',
      defaultQuality: 'Standard',
      autoAcceptOrders: false,
      maxOrdersPerHour: 20
    },
    payment: {
      acceptedMethods: ['cash', 'upi', 'card'],
      autoConfirmPayment: true
    },
    display: {
      theme: 'light',
      language: 'English',
      currency: 'INR'
    }
  })

  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof VendorSettings],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateDirectSetting = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // Here you would save to your backend
    console.log('Saving settings:', settings)
    setHasChanges(false)
    onClose()
  }

  const resetSettings = () => {
    // Reset to default values
    setSettings({
      shopName: 'Rajesh Print Shop',
      email: 'rajesh@sec128.jprint.com',
      phone: '+91 98765 43210',
      address: 'SEC-128, Main Building, Room 101',
      businessHours: {
        open: '09:00',
        close: '18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        sound: true
      },
      printing: {
        defaultPaperSize: 'A4',
        defaultQuality: 'Standard',
        autoAcceptOrders: false,
        maxOrdersPerHour: 20
      },
      payment: {
        acceptedMethods: ['cash', 'upi', 'card'],
        autoConfirmPayment: true
      },
      display: {
        theme: 'light',
        language: 'English',
        currency: 'INR'
      }
    })
    setHasChanges(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Settings Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'general', label: 'General', icon: Globe },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'printing', label: 'Printing', icon: Printer },
              { id: 'payment', label: 'Payment', icon: CreditCard },
              { id: 'display', label: 'Display', icon: Palette }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shop Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input
                        id="shopName"
                        value={settings.shopName}
                        onChange={(e) => updateDirectSetting('shopName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateDirectSetting('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateDirectSetting('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={settings.address}
                        onChange={(e) => updateDirectSetting('address', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="openTime">Opening Time</Label>
                      <Input
                        id="openTime"
                        type="time"
                        value={settings.businessHours.open}
                        onChange={(e) => updateSetting('businessHours', 'open', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="closeTime">Closing Time</Label>
                      <Input
                        id="closeTime"
                        type="time"
                        value={settings.businessHours.close}
                        onChange={(e) => updateSetting('businessHours', 'close', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Working Days</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settings.businessHours.days.includes(day)}
                            onChange={(e) => {
                              const days = e.target.checked
                                ? [...settings.businessHours.days, day]
                                : settings.businessHours.days.filter(d => d !== day)
                              updateSetting('businessHours', 'days', days)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive order updates via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Get SMS alerts for urgent orders</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Alerts</Label>
                        <p className="text-sm text-gray-600">Play sound for new orders</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sound}
                        onCheckedChange={(checked) => updateSetting('notifications', 'sound', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Printing Settings */}
          {activeTab === 'printing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    Printing Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultPaperSize">Default Paper Size</Label>
                      <Select value={settings.printing.defaultPaperSize} onValueChange={(value) => updateSetting('printing', 'defaultPaperSize', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A3">A3</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Letter">Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="defaultQuality">Default Quality</Label>
                      <Select value={settings.printing.defaultQuality} onValueChange={(value) => updateSetting('printing', 'defaultQuality', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Photo">Photo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-Accept Orders</Label>
                        <p className="text-sm text-gray-600">Automatically accept new orders</p>
                      </div>
                      <Switch
                        checked={settings.printing.autoAcceptOrders}
                        onCheckedChange={(checked) => updateSetting('printing', 'autoAcceptOrders', checked)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxOrders">Max Orders Per Hour</Label>
                      <Input
                        id="maxOrders"
                        type="number"
                        value={settings.printing.maxOrdersPerHour}
                        onChange={(e) => updateSetting('printing', 'maxOrdersPerHour', parseInt(e.target.value))}
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Accepted Payment Methods</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['cash', 'upi', 'card', 'netbanking', 'wallet'].map(method => (
                        <label key={method} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settings.payment.acceptedMethods.includes(method)}
                            onChange={(e) => {
                              const methods = e.target.checked
                                ? [...settings.payment.acceptedMethods, method]
                                : settings.payment.acceptedMethods.filter(m => m !== method)
                              updateSetting('payment', 'acceptedMethods', methods)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Confirm Payments</Label>
                      <p className="text-sm text-gray-600">Automatically confirm successful payments</p>
                    </div>
                    <Switch
                      checked={settings.payment.autoConfirmPayment}
                      onCheckedChange={(checked) => updateSetting('payment', 'autoConfirmPayment', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={settings.display.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('display', 'theme', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={settings.display.language} onValueChange={(value) => updateSetting('display', 'language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.display.currency} onValueChange={(value) => updateSetting('display', 'currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetSettings}>
                Reset to Default
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}