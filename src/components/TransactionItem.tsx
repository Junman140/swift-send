import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '@/types';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const isSend = transaction.type === 'send';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-all duration-200 shadow-card animate-slide-up"
    >
      <div
        className={cn(
          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
          isSend ? 'bg-destructive/10' : 'bg-success/10'
        )}
      >
        {isSend ? (
          <ArrowUpRight className="w-5 h-5 text-destructive" />
        ) : (
          <ArrowDownLeft className="w-5 h-5 text-success" />
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-foreground truncate">
          {transaction.recipientName}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            'font-bold text-lg',
            isSend ? 'text-foreground' : 'text-success'
          )}
        >
          {isSend ? '-' : '+'}${transaction.amount.toFixed(2)}
        </span>
        <StatusBadge status={transaction.status} />
      </div>
    </button>
  );
}
