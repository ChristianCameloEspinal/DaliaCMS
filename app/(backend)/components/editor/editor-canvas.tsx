'use client';

import type { ReactNode } from 'react';



// Area de trabajo del editor: selector de dispositivo + lienzo con scroll interno.
export function EditorCanvas({
  children,
  deviceWidth
}: {
  children: ReactNode;
  deviceWidth: number;
}) {

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-scroll h-full">

      {/* Lienzo sin vertices redondeados, para asemejarse a una web en vivo. */}
          <div 
            className="mx-auto shadow-sm"
style={{ width: `min(100%, ${deviceWidth}px)`,border:"1px solid blue"}}          >
            {children}
          </div>
    </main>
  );
}
