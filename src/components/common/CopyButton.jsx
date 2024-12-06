import React from 'react';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
      title={label}
    >
      {copied ? (
        <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <ClipboardDocumentIcon className="h-4 w-4" />
      )}
      <span className="ml-1">{label}</span>
    </button>
  );
}

export default CopyButton;