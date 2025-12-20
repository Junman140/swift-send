import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Phone,
  Mail,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: Wallet, label: 'Wallet Settings', onClick: () => {} },
    { icon: Shield, label: 'Security', onClick: () => {} },
    { icon: Bell, label: 'Notifications', onClick: () => {} },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-primary-foreground mb-6">Profile</h1>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-primary-foreground">
                {user?.name || 'User'}
              </p>
              <p className="text-primary-foreground/80">{user?.phone}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Account Info Card */}
          <div className="bg-card rounded-2xl p-5 shadow-soft animate-slide-up">
            <h2 className="font-semibold text-foreground mb-4">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{user?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div
            className="bg-card rounded-2xl shadow-soft overflow-hidden animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            {menuItems.map(({ icon: Icon, label, onClick }, index) => (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full animate-slide-up"
            style={{ animationDelay: '200ms' }}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            StellarPay v1.0.0 • Powered by Stellar
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
