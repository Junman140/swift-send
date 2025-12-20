import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'failed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-pending/15 text-pending-foreground border-pending/30',
    },
    completed: {
      icon: CheckCircle2,
      label: 'Completed',
      className: 'bg-success/15 text-success border-success/30',
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-destructive/15 text-destructive border-destructive/30',
    },
  };

  const { icon: Icon, label, className: statusClass } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        statusClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
