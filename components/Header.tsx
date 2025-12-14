import React from "react";
import { Cpu } from "lucide-react";
import { ModelOption } from "../types";
import { MODELS } from "../constants";

interface HeaderProps {
  selectedModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
  isProcessing: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedModel,
  onModelChange,
  isProcessing,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20"></div>
          <Cpu className="w-8 h-8 text-cyan-400 relative z-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
            Nizda Bench
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-widest">
            LLM EVALUATION PROTOCOL v1.0
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label
          htmlFor="model-select"
          className="text-sm font-mono text-cyan-500/70 hidden md:block"
        >
          TARGET_MODEL:
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as ModelOption)}
            disabled={isProcessing}
            aria-label="Target model"
            className="relative w-48 md:w-64 bg-slate-950 border border-slate-700 text-cyan-50 text-sm font-mono rounded p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl appearance-none"
          >
            {MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
