import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface RiderInfo {
  name: string;
  phone: string;
}

interface ChangeRiderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRider?: RiderInfo;
  onSave: (rider: RiderInfo) => void;
  previousRiders?: RiderInfo[];
}

const ChangeRiderDialog: React.FC<ChangeRiderDialogProps> = ({ open, onOpenChange, currentRider, onSave, previousRiders = [] }) => {
  const [name, setName] = useState<string>(currentRider?.name || "");
  const [phone, setPhone] = useState<string>(currentRider?.phone || "");
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setName(currentRider?.name || "");
    setPhone(currentRider?.phone || "");
    setShowNewForm(false);
  }, [currentRider, open]);

  const handleContactPicker = async () => {
    // Simulate contact picker for now - in production this would use Capacitor Contacts
    toast({
      title: "Contact picker feature",
      description: "This will use device contacts when running on mobile with Capacitor.",
    });
    
    // Demo: Populate with sample data
    setName("John Doe");
    setPhone("+1 (555) 123-4567");
    setShowNewForm(true);
  };

  const handleSelectPreviousRider = (rider: RiderInfo) => {
    onSave(rider);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change rider</DialogTitle>
          <DialogDescription>Update who this ride is for. This does not change your account.</DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {/* Previous Riders List */}
          {previousRiders.length > 0 && !showNewForm && (
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-medium">Recent riders</Label>
              {previousRiders.map((rider, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleSelectPreviousRider(rider)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Contact className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{rider.name}</p>
                      <p className="text-sm text-muted-foreground">{rider.phone}</p>
                    </div>
                  </div>
                </Button>
              ))}
              <Separator className="my-4" />
            </div>
          )}

          {/* New Rider Button */}
          {!showNewForm && (
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-3 mb-4"
              onClick={() => setShowNewForm(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">New rider</p>
                  <p className="text-sm text-muted-foreground">Add someone else</p>
                </div>
              </div>
            </Button>
          )}

          {/* New Rider Form */}
          {showNewForm && (
            <div className="grid gap-4 py-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Contact Information</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleContactPicker}
                  className="h-8 px-3"
                >
                  <Contact className="h-4 w-4 mr-1" />
                  From Contacts
                </Button>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rider-name">Rider name</Label>
                <Input
                  id="rider-name"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rider-phone">Phone number</Label>
                <Input
                  id="rider-phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {showNewForm && (
            <Button variant="ghost" onClick={() => setShowNewForm(false)}>Back</Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          {showNewForm && (
            <Button
              onClick={() => {
                onSave({ name: name.trim(), phone: phone.trim() });
                onOpenChange(false);
              }}
              disabled={!name.trim()}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRiderDialog;
