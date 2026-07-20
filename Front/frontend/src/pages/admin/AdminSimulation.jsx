import { useState } from 'react';
import adminApi from '@/services/adminApi.js';

const Simulation = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    try {
      setRunning(true);
      const res = await adminApi.runRandomSimulation(true);
      // MarketController returns an array of MarketSimulationResponse
      setResult(res.data || res);
    } catch (err) {
      console.error(err);
      setResult({ error: err.message || 'Simulation failed' });
    } finally { setRunning(false); }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Random Market Simulation</h2>
      <div className="mb-4">
        <button onClick={runSimulation} className="btn" disabled={running}>{running ? 'Đang chạy...' : 'Chạy simulation'}</button>
      </div>
      {result && (
        <div className="bg-white/5 p-3 rounded-card">
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Simulation;
