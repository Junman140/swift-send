import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContactItem } from '@/components/ContactItem';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { contacts, calculateFees } from '@/data/mockData';
import { Contact } from '@/types';
import { ArrowLeft, Search, DollarSign, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

export default function SendMoney() {
  const navigate = useNavigate();
  const { user, updateBalance } = useAuth();
  const [step, setStep] = useState<Step>('recipient');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  const fees = useMemo(() => {
    const parsedAmount = parseFloat(amount) || 0;
    return calculateFees(parsedAmount);
  }, [amount]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parsedAmount > (user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmSend = async () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const parsedAmount = parseFloat(amount);
    updateBalance((user?.balance || 0) - parsedAmount);
    
    setIsProcessing(false);
    setStep('success');
  };

  const handleBack = () => {
    if (step === 'amount') setStep('recipient');
    else if (step === 'confirm') setStep('amount');
    else navigate('/dashboard');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Money Sent Successfully!
          </h1>
          <p className="text-muted-foreground mb-2">
            ${fees.recipientGets.toFixed(2)} is on its way to
          </p>
          <p className="font-semibold text-foreground text-lg mb-6">
            {selectedContact?.name}
          </p>

          <div className="bg-card rounded-xl p-4 shadow-card mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated arrival</span>
              <span className="font-semibold text-success">~5 seconds</span>
            </div>
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {step === 'recipient' && 'Send Money'}
            {step === 'amount' && 'Enter Amount'}
            {step === 'confirm' && 'Confirm Transfer'}
          </h1>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="max-w-lg mx-auto">
          {/* Step 1: Select Recipient */}
          {step === 'recipient' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or phone number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Recent Recipients
                </p>
                {filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onClick={() => handleSelectContact(contact)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {step === 'amount' && selectedContact && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedContact.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.phone}
                  </p>
                </div>
              </div>

              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-2">You send</p>
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-5xl font-bold text-foreground bg-transparent border-none outline-none w-48 text-center"
                    autoFocus
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Balance: ${user?.balance?.toFixed(2)} USDC
                </p>
              </div>

              {parseFloat(amount) > 0 && (
                <FeeBreakdown
                  amount={parseFloat(amount)}
                  networkFee={fees.networkFee}
                  serviceFee={fees.serviceFee}
                  totalFee={fees.totalFee}
                  recipientGets={fees.recipientGets}
                />
              )}

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedContact && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-2xl p-6 shadow-soft text-center">
                <p className="text-sm text-muted-foreground mb-1">You're sending</p>
                <p className="text-4xl font-bold text-foreground mb-4">
                  ${parseFloat(amount).toFixed(2)}
                </p>
                <div className="h-px bg-border my-4" />
                <p className="text-sm text-muted-foreground mb-1">To</p>
                <p className="text-xl font-semibold text-foreground">
                  {selectedContact.name}
                </p>
                <p className="text-muted-foreground">{selectedContact.phone}</p>
              </div>

              <FeeBreakdown
                amount={parseFloat(amount)}
                networkFee={fees.networkFee}
                serviceFee={fees.serviceFee}
                totalFee={fees.totalFee}
                recipientGets={fees.recipientGets}
              />

              <div className="bg-success/10 rounded-xl p-4">
                <p className="text-sm text-success font-medium text-center">
                  ⚡ Transfer typically completes in under 5 seconds
                </p>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleConfirmSend}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="animate-pulse-soft">Processing...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Confirm & Send
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
