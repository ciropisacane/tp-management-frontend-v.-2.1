// src/components/Common/CurrencyInput.tsx

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  currency?: string;
  className?: string;
}

export const CurrencyInput = ({
  value,
  onChange,
  label,
  placeholder = '0',
  required = false,
  disabled = false,
  currency = '$',
  className = '',
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format number with thousand separators
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Parse formatted string to number
  const parseNumber = (str: string): number | null => {
    // Remove all non-digit and non-decimal characters
    const cleaned = str.replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  // Update display value when value prop changes
  useEffect(() => {
    if (value !== null && value !== undefined && !isFocused) {
      setDisplayValue(formatNumber(value));
    } else if (value === null && !isFocused) {
      setDisplayValue('');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow only numbers and decimal point while typing
    const filtered = input.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = filtered.split('.');
    const formatted = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : filtered;

    setDisplayValue(formatted);
    
    const numValue = parseNumber(formatted);
    onChange(numValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused for easier editing
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format with thousand separators when blurred
    if (value !== null && value !== undefined) {
      setDisplayValue(formatNumber(value));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{currency}</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      {/* Show formatted value preview below when focused */}
      {isFocused && value !== null && value !== undefined && (
        <p className="mt-1 text-sm text-gray-500">
          Preview: {currency}{formatNumber(value)}
        </p>
      )}
    </div>
  );
};