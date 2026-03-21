"use client";

import { useState } from 'react';

interface ScoreCardProps {
  label: string;
  desc: string;
  score: number;
}

export default function WEI() {
  const [isAssessing, setIsAssessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to evaluate system performance.');
  const scores = {
    cpu: 5.9,
    ram: 5.8,
    gpu: 5.9,
    gaming: 5.9,
    disk: 5.7,
  };

  const runAssessment = () => {
    setIsAssessing(true);
    setProgress(0);
    const messages = [
      'Assessing processor performance...',
      'Tuning system memory...',
      'Testing Aero graphics capabilities...',
      'Assessing Direct3D performance...',
      'Measuring disk transfer rate...',
      'Finalizing scores...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAssessing(false);
          setStatus('Assessment complete. Scores are current.');
          return 100;
        }
        const next = prev + 2;
        if (next % 18 === 0) {
          currentStep++;
          setStatus(messages[currentStep] ?? messages[messages.length - 1]);
        }
        return next;
      });
    }, 100);
  };

  const baseScore = Math.min(scores.cpu, scores.ram, scores.gpu, scores.gaming, scores.disk);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0] font-sans text-xs select-none">
      <div className="shrink-0 border-b border-gray-300 bg-white p-6">
        <h1 className="mb-1 text-2xl font-light text-blue-900">Performance Information and Tools</h1>
        <p className="text-gray-500">Rate and improve your computer&apos;s performance.</p>
      </div>

      {isAssessing ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-white p-10">
          <div className="w-full max-w-md">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Assessing System Performance</h2>
            <p className="mb-2 italic text-gray-600">{status}</p>
            <div className="h-5 w-full overflow-hidden rounded-sm border border-gray-400 bg-gray-200 shadow-inner">
              <div className="h-full bg-gradient-to-r from-green-400 via-green-300 to-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-[10px] text-gray-400">This may take a few minutes. Your screen may flicker.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_180px]">
            <div className="overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-300 bg-gray-100 text-left">
                  <tr>
                    <th className="p-3 font-bold text-gray-700">Component</th>
                    <th className="p-3 font-bold text-gray-700">What is rated</th>
                    <th className="p-3 text-center font-bold text-gray-700">Subscore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <ScoreCard label="Processor" desc="Calculations per second" score={scores.cpu} />
                  <ScoreCard label="Memory (RAM)" desc="Memory operations per second" score={scores.ram} />
                  <ScoreCard label="Graphics" desc="Desktop performance for Windows Aero" score={scores.gpu} />
                  <ScoreCard label="Gaming graphics" desc="3D business and gaming graphics performance" score={scores.gaming} />
                  <ScoreCard label="Primary hard disk" desc="Disk data transfer rate" score={scores.disk} />
                </tbody>
              </table>
            </div>

            <div className="flex h-[180px] flex-col items-center justify-center rounded border-2 border-blue-900 bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-2xl">
              <span className="text-5xl font-bold drop-shadow-md">{baseScore}</span>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em]">Base score</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium text-blue-900">Your scores are up to date.</div>
                <div className="text-[10px] text-blue-700">{status}</div>
              </div>
            </div>
            <button onClick={runAssessment} className="rounded-sm border border-gray-400 bg-gradient-to-b from-white to-gray-200 px-4 py-1 font-medium shadow-sm hover:brightness-105">
              Re-run the assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, desc, score }: ScoreCardProps) {
  return (
    <tr>
      <td className="p-3 font-bold text-gray-800">{label}</td>
      <td className="p-3 text-gray-500">{desc}</td>
      <td className="p-3 text-center text-lg font-bold">{score}</td>
    </tr>
  );
}
