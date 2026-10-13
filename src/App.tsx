import React from 'react';
import { ShieldCheck, Wifi, Battery, Search, Smartphone } from 'lucide-react';

export default function App(): React.JSX.Element {
  return (
    <div className="w-full max-w-[430px] min-h-[100dvh] bg-slate-900 border-x border-slate-800 flex flex-col justify-between shadow-2xl relative">
      {/* Top Status Bar */}
      <header className="px-6 pt-3 pb-2 flex justify-between items-center text-xs text-slate-400 select-none">
        <span className="font-semibold text-slate-200">23:45</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wide text-slate-400">VinaPhone 5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[10px]">42%</span>
            <Battery className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-400 shadow-inner">
          <Search className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-2">
          Bắt được Tiểu tam
        </h1>
        <p className="text-xs text-rose-400 font-medium tracking-wide uppercase mb-4">
          Jealous Wife Detective Game
        </p>

        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
          Hệ thống điều tra điện thoại ảo đã kết nối thành công với GitHub Pages CI/CD pipeline.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Pipeline & Static Hosting Ready</span>
        </div>
      </main>

      {/* Bottom Mock Navigation / Home Indicator */}
      <footer className="py-4 flex flex-col items-center gap-2 text-slate-600">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Virtual Phone Container</span>
        </div>
        <div className="w-32 h-1 bg-slate-700 rounded-full mt-1" />
      </footer>
    </div>
  );
}
