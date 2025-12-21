import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText,
  Camera,
  Shield,
  CheckCircle2,
  Upload,
  Eye,
  Award,
  ArrowRight,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { useCompliance } from '@/contexts/ComplianceContext';
import { COMPLIANCE_TIERS } from '@/types/compliance';

type VerificationStep = 'documents' | 'identity' | 'address' | 'review' | 'complete';

export function VerificationFlow() {
  const { status, verification, startVerification } = useCompliance();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('documents');
  const [uploadedDocs, setUploadedDocs] = useState({
    governmentId: false,
    proofOfAddress: false,
    selfie: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!status || !verification) return null;

  const targetTier = COMPLIANCE_TIERS[status.nextTier?.id || 'verified'];
  const steps = [
    { id: 'documents', label: 'Upload Documents', icon: FileText },
    { id: 'identity', label: 'Verify Identity', icon: Camera },
    { id: 'address', label: 'Proof of Address', icon: Shield },
    { id: 'review', label: 'Review & Submit', icon: Eye },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDocumentUpload = (docType: keyof typeof uploadedDocs) => {
    // Simulate document upload
    setUploadedDocs(prev => ({ ...prev, [docType]: true }));
  };

  const handleNext = () => {
    const stepOrder: VerificationStep[] = ['documents', 'identity', 'address', 'review', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep('complete');
    setIsSubmitting(false);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'documents':
        return uploadedDocs.governmentId;
      case 'identity':
        return uploadedDocs.selfie;
      case 'address':
        return uploadedDocs.proofOfAddress;
      case 'review':
        return Object.values(uploadedDocs).every(Boolean);
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'documents':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Government-Issued ID</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We need a clear photo of your driver's license, passport, or state ID
              </p>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                {uploadedDocs.governmentId ? (
                  <div className="text-green-600">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Government ID uploaded successfully</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <Button 
                      onClick={() => handleDocumentUpload('governmentId')}
                      variant="outline"
                    >
                      Upload Government ID
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your documents are encrypted and stored securely. We only use them for verification and 
                compliance with financial regulations.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Take a Selfie</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll compare this with your ID to verify your identity
              </p>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                {uploadedDocs.selfie ? (
                  <div className="text-green-600">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Selfie captured successfully</p>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <Button 
                      onClick={() => handleDocumentUpload('selfie')}
                      variant="outline"
                    >
                      Take Selfie
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Tips for a good selfie:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Face the camera directly</li>
                <li>• Remove sunglasses and hats</li>
                <li>• Ensure good lighting</li>
                <li>• Keep a neutral expression</li>
              </ul>
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Proof of Address</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a recent utility bill, bank statement, or lease agreement
              </p>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                {uploadedDocs.proofOfAddress ? (
                  <div className="text-green-600">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Address verification uploaded</p>
                  </div>
                ) : (
                  <div>
                    <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <Button 
                      onClick={() => handleDocumentUpload('proofOfAddress')}
                      variant="outline"
                    >
                      Upload Address Proof
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Accepted documents: utility bills, bank statements, lease agreements, or tax documents 
                dated within the last 90 days.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Government ID</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Identity Verification</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Address Verification</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                All required documents have been uploaded. Review and submit for verification.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                You're upgrading to {targetTier.name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Per Transfer:</span>
                  <div className="font-semibold">${targetTier.singleTransactionLimit.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <div className="font-semibold">${targetTier.monthlyLimit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Verification Submitted!</h3>
              <p className="text-muted-foreground">
                Your documents are being reviewed. You'll receive an email within 1-2 business days.
              </p>
            </div>
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Verification typically takes 1-2 business days. You can continue using your current limits 
                while we review your application.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-2">Account Verification</h1>
          <p className="text-muted-foreground">
            Upgrade to {targetTier.name} for higher transfer limits
          </p>
        </div>
      </header>

      <main className="px-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-primary text-primary-foreground' 
                          : isCurrent 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}
              
              {currentStep !== 'complete' && (
                <div className="flex gap-3 pt-6">
                  <Button
                    onClick={currentStep === 'review' ? handleSubmit : handleNext}
                    disabled={!canProceedToNext() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : currentStep === 'review' ? 'Submit for Review' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}