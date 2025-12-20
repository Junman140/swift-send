import { Info, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeeBreakdownProps {
  amount: number;
  networkFee: number;
  serviceFee: number;
  totalFee: number;
  recipientGets: number;
  className?: string;
}

export function FeeBreakdown({
  amount,
  networkFee,
  serviceFee,
  totalFee,
  recipientGets,
  className,
}: FeeBreakdownProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl p-5 shadow-card space-y-4 animate-scale-in',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Info className="w-4 h-4 text-primary" />
        Fee Breakdown
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-accent" />
            <span>Network fee (Stellar)</span>
          </div>
          <span className="font-medium text-foreground">${networkFee.toFixed(3)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>Service fee (0.2%)</span>
          </div>
          <span className="font-medium text-foreground">${serviceFee.toFixed(2)}</span>
        </div>

        <div className="h-px bg-border my-2" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total fees</span>
          <span className="font-semibold text-foreground">${totalFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-success/10 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-success" />
            <span className="font-medium text-foreground">Recipient gets</span>
          </div>
          <span className="text-xl font-bold text-success">
            ${recipientGets.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-7">
          Arrives in seconds, not days
        </p>
      </div>
    </div>
  );
}
