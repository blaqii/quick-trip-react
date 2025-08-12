import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangeRiderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName?: string;
  onSave: (name: string) => void;
}

const ChangeRiderDialog: React.FC<ChangeRiderDialogProps> = ({ open, onOpenChange, currentName, onSave }) => {
  const [name, setName] = useState<string>(currentName || "");

  useEffect(() => {
    setName(currentName || "");
  }, [currentName, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change rider</DialogTitle>
          <DialogDescription>Update who this ride is for. This does not change your account.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="rider-name">Rider name</Label>
            <Input
              id="rider-name"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onSave(name.trim());
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
