import React from 'react';
import { PhoneShell } from './shell/PhoneShell';

export default function App(): React.JSX.Element {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#090d16]">
      <PhoneShell />
    </div>
  );
}
