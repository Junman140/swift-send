import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ArrowRight,
  Shield,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';
import { useCompliance } from '@/contexts/ComplianceContext';
import { ComplianceCheck } from '@/types/compliance';
import { cn } from '@/lib/utils';

interface ComplianceCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  amount: number;
  destination: string;
  recipientName?: string;
}

export function ComplianceCheckDialog({ 
  isOpen, 
  onClose, 
  onProceed, 
  amount, 
  destination,
  recipientName 
}: ComplianceCheckDialogProps) {
  const { checkTransactionCompliance, status, upgradeToTier, startVerification } = useCompliance();
  const [showUpgradeFlow, setShowUpgradeFlow] = useState(false);

  if (!isOpen || !status) return null;

  const check = checkTransactionCompliance(amount, destination);
  const riskAssessment = useCompliance().assessTransactionRisk(amount, destination);

  const handleUpgrade = async () => {
    if (status.nextTier) {
      setShowUpgradeFlow(true);
    }
  };

  const handleStartVerification = async () => {
    await startVerification('enhanced');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Transfer Review
            </CardTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Transaction Summary */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">Sending to</span>
              <span className="font-medium">{recipientName || 'Recipient'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-semibold">${amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Compliance Status */}
          {check.canProceed ? (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                This transfer is within your current limits and can proceed immediately.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                This transfer cannot proceed with your current account status.
              </AlertDescription>
            </Alert>
          )}

          {/* Requirements */}
          {check.requirements.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Requirements
              </h4>
              <div className="space-y-2">
                {check.requirements.map((req, index) => (
                  <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                    {req}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {check.warnings.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-amber-600">Notices</h4>
              <div className="space-y-2">
                {check.warnings.map((warning, index) => (
                  <div key={index} className="text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade Incentive */}
          {check.upgradeIncentive && !showUpgradeFlow && (
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary mb-1">Unlock Higher Limits</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {check.upgradeIncentive}
                  </p>
                  <Button size="sm" onClick={handleUpgrade} variant="outline">
                    View Upgrade Options
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Flow */}
          {showUpgradeFlow && status.nextTier && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Upgrade to {status.nextTier.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete verification to increase your limits
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="text-lg font-semibold">
                      ${status.nextTier.singleTransactionLimit.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Per Transfer</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="text-lg font-semibold">
                      ${status.nextTier.monthlyLimit.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Monthly</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-medium">Required:</h5>
                  {status.nextTier.upgradeRequirements?.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="w-3 h-3 text-muted-foreground" />
                      {req}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleStartVerification}>
                    Start Verification
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowUpgradeFlow(false)}>
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Risk Information */}
          {riskAssessment.score > 30 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Enhanced Security Review
                  </h5>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    This transfer may require additional verification time for security purposes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onProceed}
              disabled={!check.canProceed}
              className="flex-1"
            >
              {check.canProceed ? 'Continue Transfer' : 'Cannot Proceed'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {/* Educational Footer */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              These checks help us maintain secure partnerships with banks and cash-out locations worldwide,
              ensuring your money reaches its destination safely.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CompliancePreCheck({ amount, destination, children }: { 
  amount: number;
  destination: string;
  children: React.ReactElement;
}) {
  const { checkTransactionCompliance } = useCompliance();
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const check = checkTransactionCompliance(amount, destination);
    
    if (!check.canProceed || check.warnings.length > 0) {
      setShowDialog(true);
    } else {
      // If everything is fine, proceed with original action
      const originalOnClick = children.props.onClick;
      if (originalOnClick) originalOnClick(e);
    }
  };

  const handleProceed = () => {
    setShowDialog(false);
    const originalOnClick = children.props.onClick;
    if (originalOnClick) originalOnClick();
  };

  return (
    <>
      {React.cloneElement(children, { onClick: handleClick })}
      <ComplianceCheckDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onProceed={handleProceed}
        amount={amount}
        destination={destination}
      />
    </>
  );
}