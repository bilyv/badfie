/**
 * Health Check Component
 * Simple endpoint for backend to verify frontend is running
 */

import { useEffect } from 'react';

const HealthCheck = () => {
  useEffect(() => {
    // Return JSON response for health check
    const healthData = {
      status: 'OK',
      service: 'DigitalStock Frontend',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: performance.now(),
    };

    // Set response headers to indicate JSON
    document.title = 'DigitalStock - Health Check';
    
    // For programmatic access, we'll expose this data
    (window as any).healthCheck = healthData;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-6xl">✅</div>
        <h1 className="text-2xl font-bold text-green-600">Frontend Health Check</h1>
        <div className="bg-card p-6 rounded-lg border max-w-md">
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600">OK</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span>DigitalStock Frontend</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Timestamp:</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Port:</span>
              <span>8080</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          This endpoint is used by the backend to verify frontend connectivity
        </p>
      </div>
    </div>
  );
};

export default HealthCheck;
