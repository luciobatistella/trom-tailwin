"use client"

import DetalhesRendaVariavel from "./detalhes-renda-variavel"
import DetalhesRendaFixaPublica from "./detalhes-renda-fixa-publica"
import DetalhesRendaFixaPrivada from "./detalhes-renda-fixa-privada"
import DetalhesFundosClubes from "./detalhes-fundos-clubes"
import DetalhesFinanceiro from "./detalhes-financeiro"
import DetalhesTesouroDireto from "./detalhes-tesouro-direto"
import DetalhesGarantias from "./detalhes-garantias"   

export default function DetalhesDashboard({ 
  data, 
  activeTab, 
  isVisible, 
  onClose,
  categoriaTitle,     // ← Nova prop para o breadcrumb
  subcategoriaLabel   // ← Nova prop para o breadcrumb
}) {
  console.log("🔍 DetalhesDashboard renderizado:", {
    hasData: !!data,
    isVisible,
    activeTab,
    dataType: typeof data,
    dataKeys: data ? Object.keys(data) : [],
    data: data,
    categoriaTitle,        // ← Log das novas props
    subcategoriaLabel,     // ← Log das novas props
  })

  if (!data && isVisible) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-red-900 text-white p-4 z-50">
        <h3>ERRO: Dados não fornecidos</h3>
        <button onClick={onClose} className="bg-white text-red-900 p-2 mt-4">
          Fechar
        </button>
      </div>
    )
  }

  if (!data && !isVisible) {
    return null
  }

  // ✅ DETECÇÃO BASEADA NO activeTab
  const determinarTipo = (tab) => {
    console.log("🔍 Determinando tipo baseado no activeTab:", tab)
    console.log("🔍 Tipo do activeTab:", typeof tab)

    if (!tab) {
      console.log("❌ activeTab não fornecido, usando padrão")
      return "renda-variavel"
    }

    switch (tab) {
      case "rendaVariavel":
        console.log("✅ Detectado como renda-variavel")
        return "renda-variavel"

      case "rfPublica":
        console.log("✅ Detectado como renda-fixa-publica")
        return "renda-fixa-publica"

      case "tesouroDireto":
        console.log("✅ Detectado como renda-fixa-publica (tesouro)")
        return "tesouro-direto"

      case "rfPrivada":
        console.log("✅ Detectado como renda-fixa-privada")
        return "renda-fixa-privada"

      case "fundos":
        console.log("✅ Detectado como fundos-clubes")
        return "fundos-clubes"

      case "saldoConta":
        console.log("✅ Detectado como financeiro")
        return "financeiro"

      case "garantias":
        console.log("✅ Detectado como garantias")
        return "garantias"

      default:
        console.log("✅ ActiveTab não reconhecido, usando renda-variavel (padrão)")
        return "renda-variavel"
    }
  }

  const tipo = determinarTipo(activeTab)
  console.log("🔍 Tipo FINAL determinado:", tipo)

  switch (tipo) {
    case "renda-fixa-publica":
      console.log("🔍 Renderizando DetalhesRendaFixaPublica")
      return (
        <DetalhesRendaFixaPublica 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "renda-fixa-privada":
      console.log("🔍 Renderizando DetalhesRendaFixaPrivada")
      return (
        <DetalhesRendaFixaPrivada 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "fundos-clubes":
      console.log("🔍 Renderizando DetalhesFundosClubes")
      return (
        <DetalhesFundosClubes 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "financeiro":
      console.log("🔍 Renderizando DetalhesFinanceiro")
      return (
        <DetalhesFinanceiro 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "garantias":
      console.log("🔍 Renderizando DetalhesGarantias")
      return (
        <DetalhesGarantias 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "tesouro-direto":
      console.log("🔍 Renderizando DetalhesTesouroDireto")
      return (
        <DetalhesTesouroDireto 
          ativo={data} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )

    case "renda-variavel":
    default:
      console.log("🔍 Renderizando DetalhesRendaVariavel")
      return (
        <DetalhesRendaVariavel 
          ativo={data} 
          codigo={data.codigo || "AÇÃO"} 
          isVisible={isVisible} 
          onClose={onClose}
          categoriaTitle={categoriaTitle}        // ← Passar para o breadcrumb
          subcategoriaLabel={subcategoriaLabel}  // ← Passar para o breadcrumb
        />
      )
  }
}