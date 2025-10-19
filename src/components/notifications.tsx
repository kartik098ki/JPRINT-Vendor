'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, DollarSign, Package, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'order' | 'payment' | 'system' | 'message'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationSound {
  play: () => void
}

export function useNotificationSound(): NotificationSound {
  const play = useCallback(() => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (error) {
      console.log('Audio play failed:', error)
    }
  }, [])

  return { play }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { play } = useNotificationSound()

  // Generate mock notifications for demo
  const generateMockNotification = useCallback((): Notification => {
    const types: Notification['type'][] = ['order', 'payment', 'system', 'message']
    const type = types[Math.floor(Math.random() * types.length)]
    
    const notificationsByType = {
      order: {
        title: '📦 New Order Received',
        messages: [
          'Urgent 3D print job from Computer Science department',
          'Large format poster request from Engineering club',
          'Rush thesis printing from graduate student',
          'Bulk document scan from administration office'
        ]
      },
      payment: {
        title: '💳 Payment Update',
        messages: [
          'Payment received for order #1234',
          'Payment failed for order #1235 - please follow up',
          'Refund processed for order #1233',
          'New payment method added by customer'
        ]
      },
      system: {
        title: '🔧 System Alert',
        messages: [
          'Printer maintenance scheduled for tomorrow',
          'Low paper warning in Printer A2',
          'System backup completed successfully',
          'New software update available'
        ]
      },
      message: {
        title: '💬 Customer Message',
        messages: [
          'Customer asking about order status',
          'Urgent: Need to modify print specifications',
          'Thank you for the quick service!',
          'Question about bulk pricing'
        ]
      }
    }

    const selectedType = notificationsByType[type]
    const message = selectedType.messages[Math.floor(Math.random() * selectedType.messages.length)]
    
    return {
      id: Date.now().toString() + Math.random(),
      type,
      title: selectedType.title,
      message,
      timestamp: new Date(),
      read: false,
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    }
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification = generateMockNotification()
        setNotifications(prev => [newNotification, ...prev].slice(0, 50))
        
        // Play sound for high priority notifications
        if (newNotification.priority === 'high') {
          play()
        }
        
        // Show toast for immediate visibility
        toast({
          title: newNotification.title,
          description: newNotification.message,
          duration: 5000,
        })
      }
    }, 10000)

    // Initial notifications
    setNotifications([
      {
        id: '1',
        type: 'order',
        title: '📦 New Order Received',
        message: 'Urgent 3D print job from Computer Science department',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'payment',
        title: '💳 Payment Received',
        message: 'Payment confirmed for order #1234 - ₹450.00',
        timestamp: new Date(Date.now() - 600000),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'system',
        title: '🔧 Printer Status',
        message: 'Printer A1 maintenance completed successfully',
        timestamp: new Date(Date.now() - 900000),
        read: true,
        priority: 'low'
      }
    ])

    return () => clearInterval(interval)
  }, [generateMockNotification, play, toast])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'system': return <AlertCircle className="h-4 w-4" />
      case 'message': return <MessageSquare className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      case 'low': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`mb-2 p-3 rounded-lg border transition-all cursor-pointer ${
                      notification.read ? 'opacity-60' : ''
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${
                          notification.type === 'order' ? 'text-blue-600' :
                          notification.type === 'payment' ? 'text-green-600' :
                          notification.type === 'system' ? 'text-orange-600' :
                          'text-purple-600'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  )
}