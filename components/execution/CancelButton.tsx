"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban, Loader2 } from "lucide-react";

interface CancelButtonProps {
  onCancel: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function CancelButton({
  onCancel,
  disabled = false,
  className,
}: CancelButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancel();
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error cancelling workflow:", error);
      // Error handling is done in the parent component
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isCancelling) {
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancelClick}
        disabled={disabled || isCancelling}
        className={className}
        aria-label="Cancel workflow execution"
      >
        <Ban className="h-4 w-4" />
        Cancel Workflow
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Workflow?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this workflow? Any steps that
              have already completed will be preserved, but in-progress and
              pending steps will be cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isCancelling}
            >
              Keep Running
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Yes, Cancel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
