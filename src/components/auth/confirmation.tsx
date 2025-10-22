'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/action/password';

function Confirmation({
  email,
  setNext,
}: {
  email: string;
  setNext: (value: boolean) => void;
}) {
  if (!email.length) {
    setNext(false);
  }

  const RESEND_COOLDOWN = 60; // seconds
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [isSending, setIsSending] = useState(false);

  // Start the countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setIsSending(true);
    const res = await resetPassword({ email });

    if (res.success) {
      toast.success('Email resent successfully!');
      setTimer(RESEND_COOLDOWN); // restart cooldown
    } else {
      toast.error('Failed to resend email. Please try again.');
    }

    setIsSending(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <h4>
        Check Your Email
      </h4>
      <div className="bg-gray-100 p-4 rounded-md my-6 text-sm text-gray-700">
        We’ve sent you an email to reset your password. It may take up to{' '}
        <span className="font-medium">1 minute</span> for the email to arrive.
        Please follow the link in the email to proceed.
      </div>
      <Button onClick={handleResend} disabled={isSending || timer > 0}>
        {isSending
          ? 'Resending...'
          : timer > 0
          ? `Resend in ${timer}s`
          : 'Resend Email'}
      </Button>
    </div>
  );
}

export default Confirmation;
