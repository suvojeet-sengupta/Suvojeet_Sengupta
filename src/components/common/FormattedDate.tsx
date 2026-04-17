'use client';

import { useEffect, useState } from 'react';

interface FormattedDateProps {
  date: string;
  className?: string;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * A component that safely renders a date in the user's local timezone.
 * Handles UTC strings from D1 and prevents hydration mismatch.
 */
export function FormattedDate({ date, className, options }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (!date) return;

    // SQLite/D1 often returns 'YYYY-MM-DD HH:MM:SS'. 
    // We convert it to ISO 8601 'YYYY-MM-DDTHH:MM:SSZ' to ensure UTC parsing.
    let dateObj: Date;
    if (date.includes('T') || date.includes('Z')) {
      dateObj = new Date(date);
    } else {
      // Replace space with T and append Z for UTC
      dateObj = new Date(date.replace(' ', 'T') + 'Z');
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    setFormatted(dateObj.toLocaleDateString('en-IN', options || defaultOptions));
  }, [date, options]);

  // Return an empty span or a skeleton-like placeholder initially to avoid hydration mismatch
  if (!formatted) {
    return <span className={className}>...</span>;
  }

  return <span className={className} suppressHydrationWarning>{formatted}</span>;
}
