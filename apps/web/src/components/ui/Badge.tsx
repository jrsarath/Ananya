import React from 'react';

export interface BadgeProps {
  variant?: 'receipt' | 'transfer' | 'issue' | 'adjustment' | 'neutral' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  let badgeClass = 'badge-neutral';
  
  if (variant === 'receipt' || variant === 'success') {
    badgeClass = 'badge-receipt';
  } else if (variant === 'transfer') {
    badgeClass = 'badge-transfer';
  } else if (variant === 'issue' || variant === 'danger') {
    badgeClass = 'badge-issue';
  } else if (variant === 'adjustment' || variant === 'warning') {
    badgeClass = 'badge-adjustment';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children}
    </span>
  );
}
