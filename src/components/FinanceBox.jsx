// src/components/FinanceBox.jsx
import React from 'react';

export default function FinanceBox({ total }) {
  return (
    <div className="bg-[#353535] p-4 m-2 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-[#bbb]">Valor Total</div>
          <div className="text-2xl font-bold text-white">R$ {total}</div>
        </div>
        <div className="px-3 py-1 bg-[#21dd74] text-[#111] rounded-full text-sm font-bold">
          +2,31%
        </div>
      </div>
    </div>
  );
}