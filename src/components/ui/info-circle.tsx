
import React from 'react';
import { Info } from 'lucide-react';

interface InfoCircleProps {
  className?: string;
}

export function InfoCircle({ className }: InfoCircleProps) {
  return (
    <Info className={className} />
  );
}
