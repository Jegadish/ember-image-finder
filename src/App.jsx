import React, { useState, useEffect } from 'react';
import Statistics from './components/Statistics';
import ReferencedImages from './components/ReferencedImages';
import UnreferencedImages from './components/UnreferencedImages';
import Summary from './components/Summary';
import DirectoryForm from './components/DirectoryForm';
import { Toaster } from 'react-hot-toast';

function App() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const response = await fetch('/validation-report.json');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();

    // Set up SSE connection for report updates
    const eventSource = new EventSource('http://localhost:3001/api/watch-report');
    
    eventSource.onmessage = () => {
      fetchReport();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Image Validation Report
        </h1>
        
        <DirectoryForm onValidationStart={() => setIsLoading(true)} />
        
        {reportData && (
          <div className="grid gap-8">
            <Statistics statistics={reportData.statistics} />
            <Summary summary={reportData.summary} />
            <ReferencedImages images={reportData.referencedImages} />
            <UnreferencedImages images={reportData.unreferencedImages} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;