// src/components/RelatorioFinanceiro.jsx
import React from 'react';
import { BarChart3Icon } from 'lucide-react';

export default function RelatorioFinanceiro() {
  return (
    <div className="bg-[#2a2a2a] text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Relatório Financeiro</h2>
        <BarChart3Icon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="bg-[#353535] p-3 ">
          <div className="flex justify-between mb-1">
            <div className="text-sm">Renda Variável</div>
            <div className="text-sm font-bold">39,4%</div>
          </div>
          <div className="w-full bg-[#444] rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '39.4%' }}></div>
          </div>
        </div>
        
        <div className="bg-[#353535] p-3 rounded-lg">
          <div className="flex justify-between mb-1">
            <div className="text-sm">Renda Fixa</div>
            <div className="text-sm font-bold">60,6%</div>
          </div>
          <div className="w-full bg-[#444] rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60.6%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}