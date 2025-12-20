import { useState } from 'react';
import { TransactionItem } from '@/components/TransactionItem';
import { BottomNav } from '@/components/BottomNav';
import { transactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'sent' | 'received';

export default function History() {
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'sent') return tx.type === 'send';
    if (filter === 'received') return tx.type === 'receive';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-foreground mb-4">
            Transaction History
          </h1>

          <div className="flex gap-2">
            {(['all', 'sent', 'received'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  filter === f
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="max-w-lg mx-auto space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slide-up"
              >
                <TransactionItem transaction={transaction} onClick={() => {}} />
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
