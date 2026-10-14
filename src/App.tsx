import React from 'react';
import { PhoneShell } from './shell/PhoneShell';

export default function App(): React.JSX.Element {
  return (
    <div className="w-full h-full flex justify-center items-center bg-[#090d16] overflow-hidden">
      <PhoneShell />
    </div>
  );
}
