import React, { useState, useEffect } from 'react';
import { ModelOption, Benchmark, RunResponse } from './types';
import { fetchBenchmarks, runBenchmark } from './services/api';
import Header from './components/Header';
import BenchmarkList from './components/BenchmarkList';
import TerminalOutput from './components/TerminalOutput';

function App() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(ModelOption.DEEPSEEK_V3_2);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string | null>(null);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Load benchmarks on mount
  useEffect(() => {
    fetchBenchmarks().then(setBenchmarks);
  }, []);

  const handleRun = async (benchmarkId: string) => {
    setStatus('loading');
    setActiveBenchmarkId(benchmarkId);
    setResult(null);
    setLogs([]);

    // Simulate progressive logging
    const logInterval = setInterval(() => {
        setLogs(prev => {
            const messages = [
                "> Initializing connection...",
                "> Allocating tensors...",
                "> Context window: 128k",
                "> Inference started...",
                "> Stream receiving..."
            ];
            const nextIdx = prev.length;
            if (nextIdx < messages.length) {
                return [...prev, messages[nextIdx]];
            }
            return prev;
        });
    }, 300);

    try {
      const response = await runBenchmark({
        model_name: selectedModel,
        benchmark_id: benchmarkId
      });
      clearInterval(logInterval);
      setResult(response);
      setStatus('success');
    } catch (error) {
      console.error(error);
      clearInterval(logInterval);
      setStatus('error');
    } finally {
        // Keep the active ID for a moment or indefinitely to show what was run
        // setActiveBenchmarkId(null); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        isProcessing={status === 'loading'}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-88px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Left Panel - Benchmark List */}
          <div className="lg:col-span-1 bg-slate-900/50 rounded-xl border border-slate-800/60 overflow-hidden flex flex-col backdrop-blur-sm">
             <BenchmarkList 
                benchmarks={benchmarks}
                onRun={handleRun}
                isProcessing={status === 'loading'}
                activeBenchmarkId={activeBenchmarkId}
             />
          </div>

          {/* Right Panel - Terminal */}
          <div className="lg:col-span-2 h-[500px] lg:h-auto">
             <TerminalOutput 
                status={status}
                result={result}
                logs={logs}
             />
          </div>

        </div>
      </main>
      
      {/* Background Ambient Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px]"></div>
      </div>
    </div>
  );
}

export default App;