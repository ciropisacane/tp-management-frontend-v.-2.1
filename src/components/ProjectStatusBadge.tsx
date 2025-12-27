import React from 'react';
import { cn } from '../lib/utils';

interface ProjectStatusBadgeProps {
    status: string;
    className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
    // Normalize status for easier matching
    const normalizedStatus = status?.toLowerCase() || 'unknown';

    let colorClass = 'bg-gray-100 text-gray-800 border-gray-200'; // Default/Unknown

    if (['completed', 'delivered', 'approved', 'final_review'].some(s => normalizedStatus.includes(s))) {
        colorClass = 'bg-success/10 text-success border-success/20';
    } else if (['in_progress', 'drafting', 'analysis', 'data_gathering'].some(s => normalizedStatus.includes(s))) {
        colorClass = 'bg-primary/10 text-primary border-primary/20';
    } else if (['review', 'pending', 'waiting'].some(s => normalizedStatus.includes(s)) || normalizedStatus === 'review_required') {
        colorClass = 'bg-warning/10 text-warning-700 border-warning/20';
    } else if (['overdue', 'blocked', 'cancelled', 'risk'].some(s => normalizedStatus.includes(s))) {
        colorClass = 'bg-danger/10 text-danger border-danger/20';
    }

    // Format label: replace underscores with spaces and capitalize
    const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                colorClass,
                className
            )}
        >
            {label}
        </span>
    );
}
