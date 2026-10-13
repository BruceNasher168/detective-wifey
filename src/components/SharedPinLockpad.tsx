import React, { useState } from 'react';
import { ChevronLeft, Lock, Delete, AlertTriangle } from 'lucide-react';

interface SharedPinLockpadProps {
  appName: string;
  targetChallengeId: string;
  expectedPin: string;
  currentStrikes: number;
  maxStrikes: number;
  onSuccess: (challengeId: string) => void;
  onFailStrike: () => void;
  onCancel: () => void;
}

export const SharedPinLockpad: React.FC<SharedPinLockpadProps> = ({
  appName,
  targetChallengeId,
  expectedPin,
  currentStrikes,
  maxStrikes,
  onSuccess,
  onFailStrike,
  onCancel,
}) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleDigitPress = (digit: string) => {
    if (isShaking || digits.length >= 4) return;

    const next = [...digits, digit];
    setDigits(next);
    setAlertMessage(null);

    if (next.length === 4) {
      const entered = next.join('');
      if (entered === expectedPin) {
        setTimeout(() => {
          onSuccess(targetChallengeId);
        }, 150);
      } else {
        // Incorrect PIN: Trigger 400ms shake, decrement strike, show alert (AC 7)
        setTimeout(() => {
          setIsShaking(true);
          onFailStrike();
          setAlertMessage('Mã PIN không chính xác! Nghi ngờ tăng lên.');

          setTimeout(() => {
            setIsShaking(false);
            setDigits([]);
          }, 400);
        }, 120);
      }
    }
  };

  const handleDelete = () => {
    if (digits.length > 0 && !isShaking) {
      setDigits(digits.slice(0, -1));
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex flex-col justify-between p-4 select-none font-sans text-white">
      {/* Top Nav */}
      <div className="flex items-center justify-between h-12">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 min-w-[44px] min-h-[44px] px-2 text-sm font-semibold text-sky-400 hover:text-sky-300 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Thoát ra</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Khóa Bảo Mật {appName}
        </span>
        <div className="w-16" />
      </div>

      {/* Meta Info */}
      <div className="text-center space-y-2 mt-2">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-md">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">NHẬP MÃ PIN 4 SỐ</h2>
        <p className="text-xs text-slate-400">Nhập mã PIN bí mật của chồng để mở khóa</p>
      </div>

      {/* 4 Dots Indicator */}
      <div
        className={`flex justify-center gap-4 my-3 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = idx < digits.length;
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                isShaking
                  ? 'border-red-500 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : isFilled
                  ? 'border-white bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                  : 'border-white/40 bg-transparent'
              }`}
            />
          );
        })}
      </div>

      {/* Alert Banner */}
      {alertMessage && (
        <div className="px-4 py-2 mx-auto rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2 animate-fadeIn max-w-xs text-center">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto w-full my-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigitPress(digit)}
            className="w-16 h-16 rounded-full bg-[#334155] border border-white/10 text-white text-2xl font-bold flex items-center justify-center mx-auto active:bg-[#6366F1] active:scale-95 transition-all shadow-md focus:outline-none"
          >
            {digit}
          </button>
        ))}
        <div className="w-16 h-16" />
        <button
          type="button"
          onClick={() => handleDigitPress('0')}
          className="w-16 h-16 rounded-full bg-[#334155] border border-white/10 text-white text-2xl font-bold flex items-center justify-center mx-auto active:bg-[#6366F1] active:scale-95 transition-all shadow-md focus:outline-none"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="w-16 h-16 rounded-full bg-transparent text-slate-400 hover:text-white flex items-center justify-center mx-auto active:scale-90 transition-all focus:outline-none"
          aria-label="Xóa"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Strike Status Footer */}
      <div className="text-center py-2 text-xs">
        <div className="text-red-300 font-semibold inline-flex items-center gap-1.5">
          <span>Lượt thử còn lại:</span>
          <span className="font-mono bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
            {currentStrikes} / {maxStrikes}
          </span>
        </div>
      </div>
    </div>
  );
};

