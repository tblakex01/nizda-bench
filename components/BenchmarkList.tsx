import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Benchmark } from "../types";

interface BenchmarkListProps {
  benchmarks: Benchmark[];
  onRun: (benchmarkId: string) => void;
  isProcessing: boolean;
  activeBenchmarkId: string | null;
}

const BenchmarkList: React.FC<BenchmarkListProps> = ({
  benchmarks,
  onRun,
  isProcessing,
  activeBenchmarkId,
}) => {
  return (
    <div className="space-y-4 p-4 md:pr-2 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-sm font-mono text-slate-400 mb-4 border-b border-slate-800 pb-2">
        AVAILABLE_TASKS ({benchmarks.length})
      </h2>

      {benchmarks.map((bench, index) => {
        const isActive = activeBenchmarkId === bench.id;

        return (
          <motion.div
            key={bench.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative group p-4 rounded-lg border transition-all duration-300
              ${
                isActive
                  ? "bg-slate-800/80 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40"
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-mono px-1.5 py-0.5 rounded border ${
                      bench.category.includes("3D")
                        ? "border-purple-500/30 text-purple-400"
                        : "border-green-500/30 text-green-400"
                    }`}
                  >
                    {bench.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {bench.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {bench.description}
                </p>
                <div className="mt-3 text-xs font-mono text-slate-500 bg-slate-950/50 p-2 rounded border border-slate-800/50 truncate">
                  &gt; {bench.prompt}
                </div>
              </div>

              <button
                onClick={() => onRun(bench.id)}
                disabled={isProcessing}
                className={`
                  ml-4 p-3 rounded-full flex-shrink-0 transition-all duration-300
                  ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 animate-pulse"
                      : "bg-slate-800 text-cyan-500 hover:bg-cyan-500 hover:text-slate-950 group-hover:scale-110"
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-slate-800 disabled:hover:text-cyan-500
                `}
                aria-label={`Run ${bench.title}`}
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Corner Accent */}
            <div
              className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors duration-300 ${isActive ? "border-cyan-400" : "border-slate-700 group-hover:border-cyan-500/50"}`}
            ></div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BenchmarkList;
