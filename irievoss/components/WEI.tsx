"use client";
import { useState, useEffect } from 'react';

export default function WEI() {
  const [isAssessing, setIsAssessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [scores, setScores] = useState({
    cpu: 5.9,
    ram: 5.8,
    gpu: 5.9,
    gaming: 5.9,
    disk: 5.7
  });

  const runAssessment = () => {
    setIsAssessing(true);
    setProgress(0);
    const messages = [
      "Assessing Processor performance...",
      "Tuning system memory...",
      "Testing Aero Graphics capabilities...",
      "Assessing Direct3D performance...",
      "Measuring disk transfer rate...",
      "Finalizing scores..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAssessing(false);
          return 100;
        }
        const newProgress = prev + 2;
        if (newProgress % 18 === 0) {
          currentStep++;
          setStatus(messages[currentStep] || messages[messages.length - 1]);
        }
        return newProgress;
      });
    }, 100);
  };

  const baseScore = Math.min(scores.cpu, scores.ram, scores.gpu, scores.gaming, scores.disk);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] font-sans text-xs select-none overflow-hidden">
      {/* HEADER */}
      <div className="bg-white p-6 border-b border-gray-300 shrink-0">
        <h1 className="text-2xl font-light text-blue-900 mb-1">Performance Information and Tools</h1>
        <p className="text-gray-500">Rate and improve your computer's performance.</p>
      </div>

      {isAssessing ? (
        /* ASSESSMENT LOADING SCREEN */
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Assessing System Performance</h2>
            <p className="mb-2 text-gray-600 italic">{status}</p>
            <div className="w-full h-5 bg-gray-200 border border-gray-400 rounded-sm overflow-hidden shadow-inner">
               <div className="h-full bg-gradient-to-r from-green-400 via-green-300 to-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-[10px] text-gray-400">This may take a few minutes. Your screen may flicker.</p>
          </div>
        </div>
      ) : (
        /* MAIN SCORE VIEW */
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left border-b border-gray-300">
                <tr>
                  <th className="p-3 font-bold text-gray-700">Component</th>
                  <th className="p-3 font-bold text-gray-700">What is rated</th>
                  <th className="p-3 font-bold text-gray-700 text-center">Subscore</th>
                  <th className="p-3 font-bold text-gray-700 text-center bg-blue-50/50">Base score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <ScoreRow label="Processor" desc="Calculations per second" score={scores.cpu} />
                <ScoreRow label="Memory (RAM)" desc="Memory operations per second" score={scores.ram} />
                <ScoreRow label="Graphics" desc="Desktop performance for Windows Aero" score={scores.gpu} />
                <ScoreRow label="Gaming graphics" desc="3D business and gaming graphics performance" score={scores.gaming} />
                <ScoreRow label="Primary hard disk" desc="Disk data transfer rate" score={scores.disk} />
              </tbody>
            </table>

            {/* THE BIG BASE SCORE BOX */}
            <div className="absolute right-10 top-[185px] w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-700 border-2 border-blue-900 rounded shadow-2xl flex flex-col items-center justify-center text-white">
               <span className="text-4xl font-bold drop-shadow-md">{baseScore}</span>
               <span className="text-[8px] uppercase font-bold tracking-tighter mt-1">Base score</span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-50 p-4 border border-blue-200 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <span className="text-blue-900 font-medium">Your scores are up to date.</span>
            </div>
            <button 
              onClick={runAssessment}
              className="px-4 py-1 border border-gray-400 bg-gradient-to-b from-white to-gray-200 hover:brightness-105 rounded-sm shadow-sm font-medium"
            >
              Re-run the assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRow({ label, desc, score }: any) {
  return (
    <tr>
      <td className="p-3 font-bold text-gray-800">{label}</td>
      <td className="p-3 text-gray-500">{desc}</td>
      <td className="p-3 text-center font-bold text-lg">{score}</td>
      <td className="bg-blue-50/20" />
    </tr>
  );
}