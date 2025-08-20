import React, { useState } from 'react';
import { ChevronLeft, Car, Camera, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface VehicleInformationProps {
  onBack: () => void;
}

const VehicleInformation: React.FC<VehicleInformationProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [vehicleData, setVehicleData] = useState({
    make: 'Toyota',
    model: 'Camry',
    year: '2022',
    color: 'Silver',
    licensePlate: 'ABC123',
    seats: '4'
  });

  const handleSave = () => {
    toast({
      title: "Vehicle Updated",
      description: "Your vehicle information has been saved",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Vehicle Information</h1>
        </div>

        {/* Vehicle Photo */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <h3 className="font-semibold mb-4">Vehicle Photo</h3>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center">
              <Car className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-2">Upload vehicle photo</p>
              <p className="text-sm text-muted-foreground mb-4">
                Clear photo of your vehicle for rider identification
              </p>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Vehicle Details</h3>
            <Button variant="ghost" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input 
                id="make"
                value={vehicleData.make}
                onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model"
                value={vehicleData.model}
                onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={vehicleData.year} onValueChange={(value) => setVehicleData({...vehicleData, year: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 25}, (_, i) => 2024 - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color"
                value={vehicleData.color}
                onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="license">License Plate</Label>
              <Input 
                id="license"
                value={vehicleData.licensePlate}
                onChange={(e) => setVehicleData({...vehicleData, licensePlate: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="seats">Passenger Seats</Label>
              <Select value={vehicleData.seats} onValueChange={(value) => setVehicleData({...vehicleData, seats: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 seat</SelectItem>
                  <SelectItem value="2">2 seats</SelectItem>
                  <SelectItem value="3">3 seats</SelectItem>
                  <SelectItem value="4">4 seats</SelectItem>
                  <SelectItem value="6">6 seats</SelectItem>
                  <SelectItem value="7">7 seats</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <h3 className="font-semibold mb-4">Required Documents</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">Vehicle Registration</p>
                <p className="text-sm text-success">✓ Verified</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">Vehicle Insurance</p>
                <p className="text-sm text-success">✓ Verified</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">Safety Inspection</p>
                <p className="text-sm text-warning">Expires in 30 days</p>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default VehicleInformation;