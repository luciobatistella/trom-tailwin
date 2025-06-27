// src/components/Orders.jsx
import React from 'react';
import { ListOrderedIcon } from 'lucide-react';

export default function Orders() {
  const orders = [
    { id: '#12345', data: '15/05/2025', ativo: 'PETR4', tipo: 'Compra', quantidade: 100, preco: 'R$ 31,02', status: 'Executada' },
    { id: '#12346', data: '15/05/2025', ativo: 'VALE3', tipo: 'Venda', quantidade: 50, preco: 'R$ 68,45', status: 'Pendente' },
    { id: '#12347', data: '14/05/2025', ativo: 'ITUB4', tipo: 'Compra', quantidade: 200, preco: 'R$ 28,75', status: 'Executada' },
    { id: '#12348', data: '14/05/2025', ativo: 'BBDC4', tipo: 'Venda', quantidade: 150, preco: 'R$ 22,30', status: 'Cancelada' },
  ];

  return (
    <div className="bg-[#2a2a2a] text-white h-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Ordens</h2>
        <ListOrderedIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-[#444]">
              <th className="pb-2">ID</th>
              <th className="pb-2">Data</th>
              <th className="pb-2">Ativo</th>
              <th className="pb-2">Tipo</th>
              <th className="pb-2">Qtd</th>
              <th className="pb-2">Preço</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-[#444] text-sm">
                <td className="py-3">{order.id}</td>
                <td className="py-3">{order.data}</td>
                <td className="py-3 font-bold">{order.ativo}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.tipo === 'Compra' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {order.tipo}
                  </span>
                </td>
                <td className="py-3">{order.quantidade}</td>
                <td className="py-3">{order.preco}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Executada' ? 'bg-green-900 text-green-300' : 
                    order.status === 'Pendente' ? 'bg-yellow-900 text-yellow-300' : 
                    'bg-red-900 text-red-300'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}