"use client"

import { useState, useEffect } from "react"

export function DetalhesBase({ 
  isVisible, 
  onClose, 
  title, 
  subtitle, 
  children, 
  actionButtons, 
  category,
  categoriaTitle,    // Nova prop - Ex: "Renda Fixa Pública"
  subcategoriaLabel  // Nova prop - Ex: "Tesouro Prefixado"
}) {
  console.log("🔍 DetalhesBase renderizado:", { isVisible, title, subtitle, category, categoriaTitle, subcategoriaLabel })

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Função para obter as classes de cor baseadas na categoria
  const getCategoryHeaderClasses = () => {
    switch (category) {
      case 'rendaVariavel':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500'
      case 'rfPublica':
        return 'bg-gradient-to-r from-green-600 to-green-700 border-green-500'
      case 'rfPrivada':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500'
      case 'fundos':
        return 'bg-gradient-to-r from-pink-600 to-pink-700 border-pink-500'
      case 'saldoConta':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500'
      case 'garantias':
        return 'bg-gradient-to-r from-orange-600 to-orange-700 border-orange-500'
      case 'tesouroDireto':
        return 'bg-gradient-to-r from-red-600 to-red-700 border-red-500'
      case 'financeiro':
        return 'bg-gradient-to-r from-cyan-600 to-cyan-700 border-cyan-500'
      default:
        return 'bg-neutral-700 border-neutral-600'
    }
  }

  // Função para renderizar o breadcrumb
  const renderBreadcrumb = () => {
    // Se não tiver categoriaTitle, não mostra breadcrumb
    if (!categoriaTitle) {
      return null
    }

    const breadcrumbItems = []

    // Adiciona a categoria principal
    breadcrumbItems.push({
      label: categoriaTitle,
      onClick: () => console.log(`Navegando para ${categoriaTitle}`)
    })

    // Adiciona a subcategoria se fornecida
    if (subcategoriaLabel) {
      breadcrumbItems.push({
        label: subcategoriaLabel,
        onClick: null // Item atual, não clicável
      })
    }

    return (
      <div className="px-4 py-2 bg-neutral-900/50 border-b border-neutral-700/50">
        <nav className="flex items-center space-x-1 text-xs">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-neutral-400 mx-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span 
                className={`${
                  index === breadcrumbItems.length - 1 
                    ? 'text-white font-medium' 
                    : 'text-neutral-300 hover:text-white cursor-pointer'
                } transition-colors`}
                onClick={item.onClick}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>
    )
  }

  if (!isVisible && !isAnimating) return null

  return (
    <>
      {/* Modal lateral */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-neutral-800 shadow-lg z-50 border-l border-neutral-800 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Container flex para organizar o layout */}
        <div className="flex flex-col h-full">
          {/* Cabeçalho com cor da categoria */}
          <div className={`flex justify-between items-center p-4 border-b transition-colors ${getCategoryHeaderClasses()}`}>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white truncate">{title}</h3>
              {subtitle && <p className="text-sm text-neutral-100 truncate">{subtitle}</p>}
            </div>
            <button
              className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-full transition-colors ml-2"
              onClick={onClose}
              title="Fechar detalhes"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Breadcrumb */}
          {renderBreadcrumb()}

          {/* Conteúdo com scroll - CORRIGIDO o overflow-h-auto para overflow-y-auto */}
          <div className={`overflow-y-auto flex-1 ${actionButtons ? 'pb-5' : 'pb-2'}`}>
            {children}
          </div>

          {/* Rodapé com botões de ação - Agora dentro do flex container */}
          {actionButtons && (
            <div className="p-4 bg-neutral-800 border-t border-neutral-600 flex-shrink-0">
              {actionButtons}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {(isVisible || isAnimating) && (
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isVisible ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={onClose}
        />
      )}
    </>
  )
}