import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Activity, Image as ImageIcon } from 'lucide-react';
import { RunResponse } from '../types';

interface TerminalOutputProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  result: RunResponse | null;
  logs: string[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ status, result, logs }) => {
  const isSvg = result?.code.trim().startsWith('<svg');

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-2xl relative">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">OUTPUT_TERMINAL</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono relative">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4"
            >
              <Activity className="w-16 h-16 opacity-20" />
              <p className="text-sm tracking-widest uppercase">System Ready. Awaiting Benchmark...</p>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-cyan-500 space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-900 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold animate-pulse">CONTACTING NEURAL NETWORK...</p>
                <div className="text-xs text-cyan-500/60 h-20 overflow-hidden flex flex-col items-center gap-1">
                   {/* Fake scrolling logs */}
                   {logs.map((log, i) => (
                     <motion.span 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block"
                     >
                       {log}
                     </motion.span>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          {status === 'success' && result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Execution Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1">MODEL_ID</span>
                  <span className="text-cyan-400 font-bold">{result.model}</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                  <span className="text-xs text-slate-500 block mb-1">TASK_ID</span>
                  <span className="text-purple-400 font-bold">{result.task}</span>
                </div>
              </div>

              {/* Visual Preview (if applicable) */}
              {isSvg && (
                <div className="border border-slate-800 rounded bg-white/5 p-4 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                   <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-slate-400">
                      <ImageIcon className="w-3 h-3" />
                      <span>VISUAL_PREVIEW</span>
                   </div>
                   <div 
                      className="p-4 bg-white rounded shadow-lg"
                      dangerouslySetInnerHTML={{ __html: result.code }}
                   />
                </div>
              )}

              {/* Code Output */}
              <div className="relative">
                <div className="absolute top-0 right-0 p-2 text-xs text-slate-500 bg-slate-900 rounded-bl border-b border-l border-slate-800 flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  RAW_OUTPUT
                </div>
                <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-xs md:text-sm text-green-400 overflow-x-auto">
                  <code>{result.code}</code>
                </pre>
              </div>

              <div className="flex items-center gap-2 text-xs text-green-500">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 EXECUTION_COMPLETE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};

export default TerminalOutput;