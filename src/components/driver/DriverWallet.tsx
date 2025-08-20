import React, { useState } from 'react';
import { ChevronLeft, Wallet, TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserTrips } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';

interface DriverWalletProps {
  onBack: () => void;
}

const DriverWallet: React.FC<DriverWalletProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { trips: myTrips, loading: tripsLoading } = useUserTrips(currentUser?.uid || '', 'driver');
  const [timeFilter, setTimeFilter] = useState('week');

  // Calculate earnings and balance
  const totalEarnings = myTrips.reduce((total, trip) => total + trip.fare, 0);
  const todaysEarnings = myTrips
    .filter(trip => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return trip.completedAt.toDate() >= today;
    })
    .reduce((total, trip) => total + trip.fare, 0);

  const currentBalance = totalEarnings * 0.8; // Simulating 80% available for payout
  const pendingBalance = totalEarnings * 0.2; // 20% pending

  const payoutHistory = [
    { id: 1, date: '2024-01-15', amount: 245.80, status: 'completed', method: 'Bank Transfer' },
    { id: 2, date: '2024-01-08', amount: 189.50, status: 'completed', method: 'Bank Transfer' },
    { id: 3, date: '2024-01-01', amount: 298.75, status: 'completed', method: 'Bank Transfer' },
  ];

  const weeklyEarnings = [
    { week: 'This week', earnings: todaysEarnings },
    { week: 'Last week', earnings: 425.30 },
    { week: '2 weeks ago', earnings: 368.90 },
    { week: '3 weeks ago', earnings: 402.15 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Wallet</h1>
        </div>

        {/* Balance Overview */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Available Balance</h2>
              <p className="text-sm text-muted-foreground">Ready for payout</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-success">${currentBalance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                ${pendingBalance.toFixed(2)} pending (available in 2-3 days)
              </p>
            </div>
            
            <Button className="w-full" size="lg">
              Cash Out
            </Button>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="bg-card rounded-xl p-4 border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Today's Earnings</p>
                <p className="text-2xl font-bold text-success">${todaysEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {myTrips.filter(trip => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return trip.completedAt.toDate() >= today;
                }).length} trips
              </p>
            </div>
          </div>
        </div>

        {/* Earnings History */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Earnings History</h3>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {weeklyEarnings.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{period.week}</span>
                </div>
                <span className="font-bold text-success">${period.earnings.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Payout History</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="space-y-3">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.date).toLocaleDateString()} • {payout.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                    {payout.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Settings */}
        <div className="bg-card rounded-xl p-6 border">
          <h3 className="font-semibold mb-4">Payout Method</h3>
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Chase Bank ••••1234</p>
                <p className="text-sm text-muted-foreground">Default payout method</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverWallet;