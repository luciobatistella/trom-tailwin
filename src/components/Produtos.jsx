// src/components/Produtos.jsx
import React from 'react';
import { PackageIcon } from 'lucide-react';

export default function Produtos() {
  const produtos = [
    { nome: 'CDB Banco XYZ', rentabilidade: '120% CDI', vencimento: '15/05/2026' },
    { nome: 'Tesouro IPCA+', rentabilidade: 'IPCA + 5,5%', vencimento: '15/08/2028' },
    { nome: 'Debênture ABC', rentabilidade: 'CDI + 2%', vencimento: '10/03/2027' },
  ];

  return (
    <div className="bg-[#2a2a2a] text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Produtos</h2>
        <PackageIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {produtos.map((item, index) => (
          <div key={index} className="bg-[#353535] p-3 rounded-lg">
            <div className="text-sm font-bold">{item.nome}</div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-400">Rentabilidade</div>
              <div className="text-xs font-bold">{item.rentabilidade}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-400">Vencimento</div>
              <div className="text-xs">{item.vencimento}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}