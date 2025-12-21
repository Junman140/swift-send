import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight,
  FileText,
  Zap,
  Award,
  Info,
  Lock,
  Users,
  Globe
} from 'lucide-react';
import { useCompliance } from '@/contexts/ComplianceContext';
import { COMPLIANCE_TIERS } from '@/types/compliance';
import { cn } from '@/lib/utils';

interface ComplianceDashboardProps {
  compact?: boolean;
  showUpgradePrompt?: boolean;
}

export function ComplianceDashboard({ compact = false, showUpgradePrompt = true }: ComplianceDashboardProps) {
  const { status, verification, startVerification } = useCompliance();
  const [showUpgradeDetails, setShowUpgradeDetails] = useState(false);

  if (!status) return null;

  const currentTier = COMPLIANCE_TIERS[status.currentTier];
  const progressPercentage = Math.min((status.monthlySpent / currentTier.monthlyLimit) * 100, 100);
  
  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'premium': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'starter': return Shield;
      case 'verified': return CheckCircle2;
      case 'premium': return Award;
      default: return Shield;
    }
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTierColor(currentTier.id)}>
                    {currentTier.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Account</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${status.monthlyRemaining.toLocaleString()} left this month
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status.canUpgrade && showUpgradePrompt && (
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/verification'}>
                  Upgrade
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => window.location.href = '/compliance-info'}
                className="text-xs"
              >
                Learn More
                <Info className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Account Status & Limits
            </CardTitle>
            <Badge variant="secondary" className={getTierColor(currentTier.id)}>
              {currentTier.name} Tier
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trust Building Message */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Why do limits exist?
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  These limits protect you and enable our partnerships with banks and cash-out locations worldwide. 
                  Higher verification levels unlock greater limits while keeping your transfers secure and compliant.
                </p>
              </div>
            </div>
          </div>

          {/* Current Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Transfer</span>
                <span className="text-sm text-muted-foreground">
                  ${currentTier.singleTransactionLimit.toLocaleString()} max
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Usage</span>
                <span className="text-sm text-muted-foreground">
                  ${status.monthlySpent.toLocaleString()} / ${currentTier.monthlyLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                ${status.monthlyRemaining.toLocaleString()} remaining this month
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily</span>
                <span className="text-sm font-semibold">
                  ${status.dailyRemaining.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Yearly</span>
                <span className="text-sm font-semibold">
                  ${status.yearlyRemaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Your {currentTier.name} Benefits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentTier.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Prompt */}
          {status.canUpgrade && status.nextTier && showUpgradePrompt && (
            <div className="border-t pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Ready to upgrade to {status.nextTier.name}?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock higher limits and premium features with enhanced verification
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-medium">
                      Up to ${status.nextTier.singleTransactionLimit.toLocaleString()} per transfer
                    </span>
                    <span className="text-blue-600 font-medium">
                      ${status.nextTier.monthlyLimit.toLocaleString()} monthly
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowUpgradeDetails(!showUpgradeDetails)}
                  variant="outline"
                  size="sm"
                >
                  Learn More
                </Button>
              </div>

              {showUpgradeDetails && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-medium mb-2">Requirements for {status.nextTier.name}:</h5>
                  <ul className="space-y-1 mb-4">
                    {status.nextTier.upgradeRequirements?.map((req, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        {req}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => startVerification('enhanced')}
                    >
                      Start Verification
                    </Button>
                    <Button variant="ghost" size="sm">
                      Learn About Process
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust & Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Trust & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Bank Partners</h4>
              <p className="text-xs text-green-800 dark:text-green-200">
                Licensed with major financial institutions
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Global Network</h4>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                20,000+ cash-out locations worldwide
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Compliance</h4>
              <p className="text-xs text-purple-800 dark:text-purple-200">
                SOC 2 Type II certified security
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ComplianceStatusBadge() {
  const { status } = useCompliance();
  
  if (!status) return null;

  const currentTier = COMPLIANCE_TIERS[status.currentTier];
  const TierIcon = getTierIcon(status.currentTier);

  return (
    <div className="flex items-center gap-2">
      <TierIcon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium">{currentTier.name}</span>
      <Badge variant="secondary" className="text-xs">
        ${status.monthlyRemaining.toLocaleString()} left
      </Badge>
    </div>
  );
}

function getTierIcon(tierId: string) {
  switch (tierId) {
    case 'starter': return Shield;
    case 'verified': return CheckCircle2;
    case 'premium': return Award;
    default: return Shield;
  }
}