import json
import re

with open('stores-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

json_str = content[content.find('['):content.rfind(']')+1]
stores = json.loads(json_str)

def get_sort_key(s):
    code = (s.get('code') or '').strip().upper()
    name = (s.get('name') or '').strip().upper()
    
    # Check if starts with D or L
    # We check code or name if code is LOJA
    # e.g., 'D002' starts with 'D'
    # 'LOJA 02' or 'L0105' starts with 'L'
    
    first_letter = ''
    if code:
        first_letter = code[0]
    elif name:
        first_letter = name[0]
        
    if first_letter == 'D':
        group = 0
    elif first_letter == 'L':
        group = 1
    else:
        group = 2
        
    # Extract numbers in code for natural sorting (e.g. 2, 3, 4, 10, 105, 200)
    numbers = [int(n) for n in re.findall(r'\d+', code)]
    primary_num = numbers[0] if numbers else 999999
    
    return (group, primary_num, code, name)

sorted_stores = sorted(stores, key=get_sort_key)

js_content = f"""/**
 * STORES DATA - Lista Completa de Lojas (Ordenada: D -> L -> Outras em ordem crescente)
 * Total de lojas cadastradas: {len(sorted_stores)}
 */

const STORES_DATA = {json.dumps(sorted_stores, ensure_ascii=False, indent=2)};

/**
 * Função auxiliar para buscar loja por código ou ID
 */
function getStoreByIdOrCode(identifier) {{
  if (!identifier) return null;
  return STORES_DATA.find(store => store.id === identifier || store.code === identifier) || null;
}}

// Exporta globalmente no navegador
if (typeof window !== 'undefined') {{
  window.STORES_DATA = STORES_DATA;
  window.getStoreByIdOrCode = getStoreByIdOrCode;
}}
"""

with open('stores-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Lojas reordenadas com sucesso! Total: {len(sorted_stores)}")

print("\n--- Primeiras 15 Lojas (Grupo D) ---")
for s in sorted_stores[:15]:
    print(f"[{s['code']}] {s['name']}")

print("\n--- Primeiras 15 Lojas do Grupo L ---")
l_stores = [s for s in sorted_stores if s['code'].strip().upper().startswith('L')]
for s in l_stores[:15]:
    print(f"[{s['code']}] {s['name']}")
