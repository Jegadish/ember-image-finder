import React from 'react';
import { formatBytes } from '../../utils/formatters';

function FileSize({ bytes }) {
  return <span>{formatBytes(bytes)}</span>;
}

export default FileSize;