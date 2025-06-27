import json
import json5

# Caminhos
entrada = "dataRendaVariavel.js"
saida = "dataRendaVariavel-com-proventos.js"

def gerar_proventos(tipo, quantidade):
    if tipo == "pagos":
        return [{
            "numDist": 100,
            "bonusDescription": "Juros sobre Capital Próprio",
            "qty": quantidade,
            "inclusiveValue": round(0.15 * quantidade, 2),
            "ir": round(0.0225 * quantidade, 2),
            "value": round(0.1275 * quantidade, 2),
            "paymentDate": "2024-05-10"
        }]
    else:
        return [{
            "numDist": 200,
            "bonusDescription": "Dividendo",
            "qty": quantidade,
            "inclusiveValue": round(0.20 * quantidade, 2),
            "ir": round(0.03 * quantidade, 2),
            "value": round(0.17 * quantidade, 2),
            "paymentDate": "2024-06-20"
        }]

# Carrega e limpa o conteúdo JavaScript
with open(entrada, "r", encoding="utf-8") as f:
    js_content = f.read().replace("export const rendaVariavel = ", "").rstrip(";")

# Usa o json5 para fazer o parsing
dados = json5.loads(js_content)

# Adiciona os proventos
for grupo in dados.get("items", []):
    for ativo in grupo.get("ativos", []):
        if ativo.get("tipo") == "Ação":
            ativo["proventosPagos"] = gerar_proventos("pagos", ativo["quantidade"])
            ativo["proventosProvisionados"] = gerar_proventos("provisionados", ativo["quantidade"])

# Salva novamente como módulo JS
with open(saida, "w", encoding="utf-8") as f:
    f.write("export const rendaVariavel = " + json.dumps(dados, indent=2, ensure_ascii=False) + ";")

print(f"✅ Arquivo salvo com sucesso: {saida}")
