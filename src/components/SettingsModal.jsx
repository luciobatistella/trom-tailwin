// src/components/SettingsModal.jsx
import React from 'react';

export default function SettingsModal({ open, onClose, tabStyle, onChangeTabStyle }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#2a2a2a] text-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-[#444]">
          <h2 className="text-xl font-bold">Configurações</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Estilo das Abas</h3>
            <div className="flex gap-4">
              <button
                onClick={() => onChangeTabStyle('style1')}
                className={`p-3 border rounded-lg ${
                  tabStyle === 'style1' 
                    ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                    : 'border-gray-600'
                }`}
              >
                Estilo 1
              </button>
              <button
                onClick={() => onChangeTabStyle('style2')}
                className={`p-3 border rounded-lg ${
                  tabStyle === 'style2' 
                    ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                    : 'border-gray-600'
                }`}
              >
                Estilo 2
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t border-[#444]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}