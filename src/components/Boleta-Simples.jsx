const BoletaSimples = ({
  tipoAtual,
  quantidade,
  preco,
  precoFracionado,
  validade,
  dataValidade,
  tipoPreco,
  ativoSelecionado,
  totalGeral,
  onClose,
  onConfirmar,
  handleQuantidadeChange,
  handleQuantidadeKeyDown,
  handleQuantidadeWheel,
  startQuantidadeChange,
  stopQuantidadeChange,
  handlePrecoChange,
  handlePrecoKeyDown,
  handlePrecoWheel,
  startPrecoChange,
  stopPrecoChange,
  handleCalendarClick,
  setTipoAtual,
  setTipoPreco,
  setValidade,
  quantidadeInputRef,
  precoInputRef,
  showConfirmationScreen
}) => {
  return (
    <div className="">
      {/* Conta */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">CONTA</label>
        <div className="w-1/2 bg-[#353535] py-1 pr-1">
          <select className="w-full bg-[#353535] border-0 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]">
            <option>Lorem</option>
          </select>
        </div>
      </div>

      {/* Tipo - Botões lado a lado */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TIPO</label>
        <div className="w-1/2 bg-[#353535] py-1 flex gap-1 px-1">
          <button
            className={`flex-1 py-1 px-2 font-semibold text-xs transition-colors ${
              tipoAtual === "comprar" ? "bg-green-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"
            }`}
            onClick={() => setTipoAtual("comprar")}
          >
            COMPRAR
          </button>
          <button
            className={`flex-1 py-1 px-2 font-semibold text-xs transition-colors ${
              tipoAtual === "vender" ? "bg-red-600 text-white" : "bg-[#444] text-[#aaa] hover:bg-[#555]"
            }`}
            onClick={() => setTipoAtual("vender")}
          >
            VENDER
          </button>
        </div>
      </div>

      {/* Quantidade */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">QUANTIDADE</label>
        <div className="w-1/2 bg-[#353535] py-1 flex items-center justify-between px-1">
          <input
            ref={quantidadeInputRef}
            type="number"
            value={quantidade}
            onChange={handleQuantidadeChange}
            onKeyDown={handleQuantidadeKeyDown}
            onWheel={handleQuantidadeWheel}
            className="flex-1 bg-[#353535] border-0 px-0 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E] mr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
          />
          <div className="flex gap-1">
            <button
              className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none"
              onMouseDown={(e) => startQuantidadeChange(false, e)}
              onMouseUp={stopQuantidadeChange}
              onMouseLeave={stopQuantidadeChange}
              onTouchStart={(e) => startQuantidadeChange(false, e)}
              onTouchEnd={stopQuantidadeChange}
            >
              −
            </button>
            <button
              className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none"
              onMouseDown={(e) => startQuantidadeChange(true, e)}
              onMouseUp={stopQuantidadeChange}
              onMouseLeave={stopQuantidadeChange}
              onTouchStart={(e) => startQuantidadeChange(true, e)}
              onTouchEnd={stopQuantidadeChange}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Tipo de Preço */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TIPO DE PREÇO</label>
        <div className="w-1/2 bg-[#353535] py-1 pr-1">
          <select
            value={tipoPreco}
            onChange={(e) => setTipoPreco(e.target.value)}
            className="w-full bg-[#353535] border-0 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]"
          >
            <option value="limitada">Limitada</option>
            <option value="mercado">A Mercado</option>
            <option value="stop">Stop</option>
          </select>
        </div>
      </div>

      {/* Preço */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">PREÇO</label>
        <div className="w-1/2 bg-[#353535] py-1 flex items-center justify-between px-1">
          <input
            ref={precoInputRef}
            type="number"
            value={ativoSelecionado ? preco.toFixed(2) : ""}
            onChange={handlePrecoChange}
            onKeyDown={handlePrecoKeyDown}
            onWheel={handlePrecoWheel}
            placeholder={ativoSelecionado ? "" : "Selecione um ativo"}
            disabled={!ativoSelecionado}
            className="flex-1 bg-[#353535] border-0 px-0 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E] mr-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:text-[#666] placeholder:text-[#666]"
            min="0"
            step="0.01"
          />
          <div className="flex gap-1">
            <button
              className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!ativoSelecionado}
              onMouseDown={(e) => startPrecoChange(false, e)}
              onMouseUp={stopPrecoChange}
              onMouseLeave={stopPrecoChange}
              onTouchStart={(e) => startPrecoChange(false, e)}
              onTouchEnd={stopPrecoChange}
            >
              −
            </button>
            <button
              className="px-2 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs select-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!ativoSelecionado}
              onMouseDown={(e) => startPrecoChange(true, e)}
              onMouseUp={stopPrecoChange}
              onMouseLeave={stopPrecoChange}
              onTouchStart={(e) => startPrecoChange(true, e)}
              onTouchEnd={stopPrecoChange}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Validade */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">VALIDADE</label>
        <div className="w-1/2 bg-[#353535] py-1 flex gap-1 px-1">
          <select
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            className="w-16 bg-[#353535] border-0 px-1 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#F7941E]"
          >
            <option value="dia">Dia</option>
            <option value="gtc">GTC</option>
            <option value="ioc">IOC</option>
          </select>
          <div className="flex-1 bg-[#353535] px-2 py-1 text-xs text-white text-center">{dataValidade}</div>
          <button
            className="w-6 px-1 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
            onClick={handleCalendarClick}
            title="Definir data de hoje"
          >
            📅
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center border-b border-[#404040]">
        <label className="w-1/2 text-xs font-semibold text-[#aaa] pl-3">TOTAL</label>
        <div className="w-1/2 bg-[#353535] py-1 px-3">
          <div className="text-sm font-bold text-white">{ativoSelecionado ? totalGeral.toFixed(2) : "--"}</div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2 p-3">
        <button
          className="px-3 py-1 bg-[#444] hover:bg-[#555] text-white transition-colors text-xs"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className={`w-20 px-3 py-1 transition-colors font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
            tipoAtual === "comprar"
              ? "bg-green-600 hover:bg-green-700 text-white disabled:hover:bg-green-600"
              : "bg-red-600 hover:bg-red-700 text-white disabled:hover:bg-red-600"
          }`}
          disabled={!ativoSelecionado}
          onClick={showConfirmationScreen}
          title={ativoSelecionado ? "Ctrl + Enter para executar rapidamente" : "Selecione um ativo primeiro"}
        >
          {tipoAtual === "comprar" ? "COMPRAR" : "VENDER"}
        </button>
      </div>
    </div>
  )
}

export default BoletaSimples
