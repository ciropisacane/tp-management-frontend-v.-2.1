// Format date to locale string
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

// Format date to ISO string (YYYY-MM-DD) for input fields
export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

// Format date to ISO-8601 DateTime for API payloads
export const formatDateForApi = (date: string | null | undefined): string | null => {
  if (!date) return null;

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString();
};

// Format datetime
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '-';
  }
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'just now' : `${diffMins} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } catch (error) {
    return '-';
  }
};

// Format currency
export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'EUR'
): string => {
  if (amount === null || amount === undefined) return '-';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '-';
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

// Format number with thousands separator
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '-';
  
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) return '-';
  
  return new Intl.NumberFormat('en-GB').format(numValue);
};

// Format percentage
export const formatPercentage = (
  value: number | string | null | undefined,
  decimals: number = 0
): string => {
  if (value === null || value === undefined) return '-';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '-';
  
  return `${numValue.toFixed(decimals)}%`;
};

// Truncate text
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text) return '-';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'U';
  
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  
  return (first + last).toUpperCase();
};

// Format file size
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Calculate days until deadline
export const getDaysUntilDeadline = (deadline: string | Date | null | undefined): number | null => {
  if (!deadline) return null;
  
  try {
    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return null;
  }
};

// Format deadline with urgency indicator
export const formatDeadlineWithUrgency = (deadline: string | Date | null | undefined): {
  text: string;
  color: string;
  daysLeft: number | null;
} => {
  const daysLeft = getDaysUntilDeadline(deadline);
  
  if (daysLeft === null) {
    return { text: '-', color: 'text-gray-500', daysLeft: null };
  }
  
  if (daysLeft < 0) {
    return {
      text: `${Math.abs(daysLeft)} days overdue`,
      color: 'text-red-600',
      daysLeft
    };
  }
  
  if (daysLeft === 0) {
    return { text: 'Due today', color: 'text-red-600', daysLeft };
  }
  
  if (daysLeft === 1) {
    return { text: 'Due tomorrow', color: 'text-orange-600', daysLeft };
  }
  
  if (daysLeft <= 7) {
    return {
      text: `Due in ${daysLeft} days`,
      color: 'text-orange-600',
      daysLeft
    };
  }
  
  if (daysLeft <= 30) {
    return {
      text: `Due in ${daysLeft} days`,
      color: 'text-yellow-600',
      daysLeft
    };
  }
  
  return {
    text: `Due in ${daysLeft} days`,
    color: 'text-gray-600',
    daysLeft
  };
};
