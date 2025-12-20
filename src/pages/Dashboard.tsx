import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionItem } from '@/components/TransactionItem';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { transactions } from '@/data/mockData';
import { Send, Plus, Bell, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">
              {user?.name?.split(' ')[0] || 'User'}
            </h1>
          </div>
          <button className="relative p-3 rounded-xl bg-card shadow-card hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
      </header>

      <main className="px-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Balance Card */}
          <BalanceCard balance={user?.balance || 0} />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="hero"
              size="lg"
              className="h-16 text-base"
              onClick={() => navigate('/send')}
            >
              <Send className="w-5 h-5" />
              Send Money
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="h-16 text-base"
              onClick={() => {}}
            >
              <Plus className="w-5 h-5" />
              Add Funds
            </Button>
          </div>

          {/* Transaction Stats */}
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">$850</p>
                <p className="text-xs text-muted-foreground">Sent this month</p>
              </div>
              <div className="border-x border-border">
                <p className="text-2xl font-bold text-success">$2.50</p>
                <p className="text-xs text-muted-foreground">Fees saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Transfers</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                See all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
