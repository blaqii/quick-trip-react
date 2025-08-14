import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiderInfo {
  name: string;
  phone: string;
}

interface ChangeRiderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRider?: RiderInfo;
  onSave: (rider: RiderInfo) => void;
}

const ChangeRiderDialog: React.FC<ChangeRiderDialogProps> = ({ open, onOpenChange, currentRider, onSave }) => {
  const [name, setName] = useState<string>(currentRider?.name || "");
  const [phone, setPhone] = useState<string>(currentRider?.phone || "");
  const { toast } = useToast();

  useEffect(() => {
    setName(currentRider?.name || "");
    setPhone(currentRider?.phone || "");
  }, [currentRider, open]);

  const handleContactPicker = async () => {
    // For now, show a placeholder message since Capacitor contacts plugin isn't available
    toast({
      title: "Feature coming soon",
      description: "Contact picker will be available when running on a mobile device.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change rider</DialogTitle>
          <DialogDescription>Update who this ride is for. This does not change your account.</DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onSave({ name: name.trim(), phone: phone.trim() });
              onOpenChange(false);
            }}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRiderDialog;
