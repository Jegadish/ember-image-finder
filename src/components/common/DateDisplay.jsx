import React from 'react';
import { formatDate } from '../../utils/formatters';

function DateDisplay({ date, label }) {
  return (
    <span className="text-sm text-gray-500">
      {label}: {formatDate(date)}
    </span>
  );
}

export default DateDisplay;