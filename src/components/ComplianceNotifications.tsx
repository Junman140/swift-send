import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp,
  Shield,
  Award,
  Clock,
  X
} from 'lucide-react';
import { useCompliance } from '@/contexts/ComplianceContext';

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'upgrade';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp: Date;
}

// Mock notifications - in real app, these would come from the compliance context
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'upgrade',
    title: 'Ready for Higher Limits?',
    message: 'Complete enhanced verification to unlock transfers up to $1,000 and higher monthly limits.',
    action: {
      label: 'Upgrade Account',
      onClick: () => console.log('Upgrade clicked')
    },
    dismissible: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    type: 'info',
    title: 'Monthly Limit Reminder',
    message: 'You have $1,200 remaining in your monthly transfer limit. Resets on January 1st.',
    dismissible: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '3',
    type: 'success',
    title: 'Account Verification Complete',
    message: 'Your identity verification has been approved! You now have access to enhanced features.',
    dismissible: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

export function ComplianceNotifications() {
  const { status } = useCompliance();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertCircle;
      case 'upgrade': return TrendingUp;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'upgrade': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-medium text-muted-foreground">No new notifications</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We'll notify you about important account updates here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Account Notifications
        </h2>
        {notifications.length > 0 && (
          <Badge variant="secondary">{notifications.length}</Badge>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClasses = getNotificationColor(notification.type);
          
          return (
            <Card key={notification.id} className={`border ${colorClasses.split(' ')[2]}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses.split(' ')[1]}`}>
                    <Icon className={`w-4 h-4 ${colorClasses.split(' ')[0]}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      
                      {notification.dismissible && (
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-muted-foreground hover:text-foreground p-1 -mt-1 -mr-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      
                      {notification.action && (
                        <Button
                          size="sm"
                          variant={notification.type === 'upgrade' ? 'default' : 'outline'}
                          onClick={notification.action.onClick}
                          className="text-xs"
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                Why do we send these notifications?
              </h4>
              <p className="text-xs text-muted-foreground">
                These updates help you stay informed about your account status, limits, and opportunities to 
                unlock enhanced features. They're designed to help you get the most out of SwiftSend while 
                ensuring regulatory compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}