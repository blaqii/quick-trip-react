import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Star, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserTrips } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';

interface DriverTripsProps {
  onBack: () => void;
}

const DriverTrips: React.FC<DriverTripsProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { trips: myTrips, loading: tripsLoading } = useUserTrips(currentUser?.uid || '', 'driver');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = myTrips.filter(trip => {
    const matchesSearch = trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.riderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    
    const tripDate = trip.completedAt.toDate();
    const now = new Date();
    
    switch (filter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tripDate >= today && matchesSearch;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tripDate >= weekAgo && matchesSearch;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return tripDate >= monthAgo && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const totalEarnings = filteredTrips.reduce((total, trip) => total + trip.fare, 0);
  const totalTrips = filteredTrips.length;
  const averageRating = 4.8; // Simulated average rating

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Trips</h1>
        </div>

        {/* Trip Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border text-center">
            <p className="text-2xl font-bold text-primary">{totalTrips}</p>
            <p className="text-sm text-muted-foreground">Total Trips</p>
          </div>
          <div className="bg-card rounded-xl p-4 border text-center">
            <p className="text-2xl font-bold text-success">${totalEarnings.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Earnings</p>
          </div>
          <div className="bg-card rounded-xl p-4 border text-center">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <p className="text-2xl font-bold">{averageRating}</p>
            </div>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {tripsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading trips...
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No trips found matching your search' : 'No trips found'}
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className="bg-card rounded-xl p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{trip.riderName}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{trip.completedAt.toDate().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{trip.completedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">${trip.fare.toFixed(2)}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-sm text-muted-foreground">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-0.5"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="font-medium text-sm truncate">{trip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full flex-shrink-0 mt-0.5"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium text-sm truncate">{trip.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>12.5 km • 25 min</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverTrips;