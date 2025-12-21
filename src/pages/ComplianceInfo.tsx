import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BottomNav } from '@/components/BottomNav';
import { 
  ArrowLeft,
  Shield,
  Users,
  Globe,
  Lock,
  CheckCircle2,
  TrendingUp,
  Award,
  FileText,
  Zap,
  Info,
  Building2,
  Star,
  Clock
} from 'lucide-react';
import { COMPLIANCE_TIERS } from '@/types/compliance';

export default function ComplianceInfo() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'SOC 2 Type II certified infrastructure with end-to-end encryption',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      icon: Users,
      title: 'Licensed Partners',
      description: '20,000+ cash-out locations through regulated financial institutions',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Fully compliant with international money transfer regulations',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      icon: Lock,
      title: 'FDIC Protection',
      description: 'Customer funds protected up to $250,000 through banking partnerships',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    }
  ];

  const benefits = [
    'Prevents fraud and protects your money',
    'Enables partnerships with banks and cash-out locations',
    'Ensures regulatory compliance in all countries',
    'Builds trust with financial institutions',
    'Provides legal protection for your transfers',
    'Enables higher transaction limits for verified users'
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Account Verification & Limits</h1>
              <p className="text-sm text-muted-foreground">
                Understanding how SwiftSend keeps your transfers secure
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Why Verification Matters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Why Verification Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                SwiftSend uses verification and limits to build trust, prevent fraud, and enable 
                partnerships with banks and cash-out locations worldwide. This isn't just bureaucracy—
                it's what makes global money transfers possible.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {features.map(({ icon: Icon, title, description, color }) => (
                  <div key={title} className={`p-3 rounded-lg border ${color}`}>
                    <Icon className="w-6 h-6 mb-2" />
                    <h4 className="font-medium text-sm mb-1">{title}</h4>
                    <p className="text-xs opacity-80">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Account Tiers & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(COMPLIANCE_TIERS).map((tier, index) => (
                <div key={tier.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tier.id === 'starter' ? 'bg-blue-100 text-blue-600' :
                        tier.id === 'verified' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {tier.id === 'starter' ? <Shield className="w-5 h-5" /> :
                         tier.id === 'verified' ? <CheckCircle2 className="w-5 h-5" /> :
                         <Award className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Per Transfer</p>
                      <p className="font-semibold">${tier.singleTransactionLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly</p>
                      <p className="font-semibold">${tier.monthlyLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Yearly</p>
                      <p className="font-semibold">${tier.yearlyLimit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Requirements:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {tier.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {index < Object.values(COMPLIANCE_TIERS).length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How It Protects You */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                How This Protects You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Simple Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Upload ID', description: 'Government-issued photo ID', time: '2 min' },
                  { step: 2, title: 'Take Selfie', description: 'Quick photo for identity verification', time: '1 min' },
                  { step: 3, title: 'Proof of Address', description: 'Recent utility bill or statement', time: '2 min' },
                  { step: 4, title: 'Review & Approval', description: 'Automated review process', time: '1-2 business days' }
                ].map(({ step, title, description, time }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{title}</h4>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <h3 className="font-semibold flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Trusted by Thousands
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">20,000+</div>
                    <div className="text-muted-foreground">Cash-out locations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">$250K</div>
                    <div className="text-muted-foreground">FDIC protection</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">3-5 sec</div>
                    <div className="text-muted-foreground">Transfer speed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex gap-3">
            <Button onClick={() => navigate('/verification')} className="flex-1">
              Start Verification
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}