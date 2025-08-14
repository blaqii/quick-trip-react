import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreditCard } from 'lucide-react';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (paymentMethod: any) => void;
}

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    const paymentMethod = {
      id: Date.now(),
      last4: cardNumber.slice(-4),
      brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      expiryMonth,
      expiryYear,
      cardholderName,
      isDefault,
    };
    onSave(paymentMethod);
    resetForm();
  };

  const resetForm = () => {
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setCardholderName('');
    setIsDefault(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0'),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i),
  }));

  const isFormValid = cardNumber.length >= 16 && expiryMonth && expiryYear && cvv.length >= 3 && cardholderName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input
              id="cardholder-name"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expiry-month">Month</Label>
              <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-year">Year</Label>
              <Select value={expiryYear} onValueChange={setExpiryYear}>
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="default-payment"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
            <Label htmlFor="default-payment" className="text-sm">
              Set as default payment method
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Add Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;