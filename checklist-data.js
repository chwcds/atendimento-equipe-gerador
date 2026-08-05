/**
 * CHECKLIST DATA - Estrutura dos Módulos e Perguntas do Checklist
 */

const CHECKLIST_MODULES = [
  {
    id: "rotina_gerador",
    name: "Inspeção de Rotina Gerador",
    shortName: "Rotina Gerador",
    icon: "zap",
    description: "Inspeção técnica e checagem de rotina do grupo gerador"
  },
  {
    id: "preventiva_gerador",
    name: "Preventiva do Gerador",
    shortName: "Preventiva Gerador",
    icon: "tool",
    description: "Manutenção preventiva completa com verificação de rotina e trocas de filtros"
  },
  {
    id: "rotina_subestacao",
    name: "Inspeção de Rotina Subestação",
    shortName: "Subestação",
    icon: "shield",
    description: "Verificação visual, segurança e relés da subestação"
  },
  {
    id: "banco_capacitores",
    name: "Inspeção Banco de Capacitor",
    shortName: "Capacitores",
    icon: "cpu",
    description: "Verificação das células, térmico e medidor de reativo"
  },
  {
    id: "eletrica",
    name: "Elétrica",
    shortName: "Elétrica",
    icon: "activity",
    description: "Inspeção dos quadros, cabos e dispositivos de proteção"
  },
  {
    id: "iluminacao",
    name: "Iluminação",
    shortName: "Iluminação",
    icon: "sun",
    description: "Nível de iluminância, emergência e lâmpadas do salão e áreas internas"
  }
];

// Perguntas por Módulo
const CHECKLIST_QUESTIONS = {
  // 1. ROTINA GERADOR
  rotina_gerador: [
    // --- Dados Técnicos ---
    {
      id: "rg_abrangencia",
      section: "Dados técnicos",
      label: "Esse gerador atende essa loja?",
      type: "options_3",
      options: ["Total", "Parcial"],
      required: true,
      noPhoto: true
    },
    {
      id: "rg_fabricante",
      section: "Dados técnicos",
      label: "Fabricante do Gerador",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: STEMAC, Cummins, MWM..."
    },
    {
      id: "rg_marca_motor",
      section: "Dados técnicos",
      label: "Marca / Motor",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: Scania, Perkins, MWM..."
    },
    {
      id: "rg_usca_controlador",
      section: "Dados técnicos",
      label: "USCA / Controlador",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: DeepSea, ComAp, Komas..."
    },
    {
      id: "rg_potencia_kva",
      section: "Dados técnicos",
      label: "Potência (kVA)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 500"
    },
    {
      id: "rg_tensao_v",
      section: "Dados técnicos",
      label: "Tensão (V)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 380 ou 220"
    },
    {
      id: "rg_qtd_baterias",
      section: "Dados técnicos",
      label: "Quantidade de Baterias",
      type: "options_3",
      options: ["1 Bateria", "2 Baterias"],
      requirePhoto: true
    },
    {
      id: "rg_amperagem_bat",
      section: "Dados técnicos",
      label: "Amperagem das baterias (Ah)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 150"
    },
    {
      id: "rg_tensao_flutuacao_bat",
      section: "Dados técnicos",
      label: "Qual a tensão de flutuação da bateria (V)?",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 27.2 ou 13.6"
    },

    // --- Sistema de Transferência ---
    {
      id: "rg_possui_qta",
      section: "Sistema de transferência",
      label: "Possui QTA (Quadro de Transferência Automática)?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhoto: true
    },
    {
      id: "rg_qta_composicao",
      section: "Sistema de transferência",
      label: "Composição do QTA",
      type: "options_3",
      options: ["Contatoras", "Disjuntores", "Chaves"],
      condition: { questionId: "rg_possui_qta", value: "Sim" },
      requirePhoto: true
    },
    {
      id: "rg_possui_qtm",
      section: "Sistema de transferência",
      label: "Gerador possui QTM?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhotoOnValue: "Sim"
    },

    // --- Checklist de Rotina ---
    {
      id: "rg_q1",
      section: "Checklist de rotina",
      label: "1. Acessibilidade à sala desobstruída?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q2",
      section: "Checklist de rotina",
      label: "2. Existe vestígio de insetos ou roedores?",
      type: "tri_state",
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Média"
    },
    {
      id: "rg_q3",
      section: "Checklist de rotina",
      label: "3. Controlador ligado, sem alarme e em automático?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "rg_q5",
      section: "Checklist de rotina",
      label: "4. Gerador sem vazamento aparente?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhotoOnValue: "Não",
      defaultPriority: "Alta"
    },
    {
      id: "rg_q6",
      section: "Checklist de rotina",
      label: "5. Baterias em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q7",
      section: "Checklist de rotina",
      label: "6. Carregador de bateria em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q8",
      section: "Checklist de rotina",
      label: "7. Conferido nível de água do radiador?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q9",
      section: "Checklist de rotina",
      label: "8. Conferido nível de óleo lubrificante?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },

    // Nível do diesel
    {
      id: "rg_nivel_diesel",
      section: "Nível do diesel",
      label: "9. Nível de combustível no tanque",
      type: "options_3",
      options: ["25%", "50%", "75%", "100%"],
      requirePhoto: true,
      required: true
    },

    // Medições
    {
      id: "rg_corrente_a",
      section: "Medições",
      label: "10. Corrente fase A (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 210"
    },
    {
      id: "rg_corrente_b",
      section: "Medições",
      label: "11. Corrente fase B (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 205"
    },
    {
      id: "rg_corrente_c",
      section: "Medições",
      label: "12. Corrente fase C (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 212"
    },

    // Fechamento
    {
      id: "rg_usca_auto",
      section: "Fechamento",
      label: "13. USCA na posição Auto?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Crítica"
    }
  ],

  // 2. PREVENTIVA GERADOR
  preventiva_gerador: [
    // --- Dados Técnicos ---
    {
      id: "pg_abrangencia",
      section: "Dados técnicos",
      label: "Esse gerador atende essa loja?",
      type: "options_3",
      options: ["Total", "Parcial"],
      required: true,
      noPhoto: true
    },
    {
      id: "pg_fabricante",
      section: "Dados técnicos",
      label: "Fabricante do Gerador",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: STEMAC, Cummins, MWM..."
    },
    {
      id: "pg_marca_motor",
      section: "Dados técnicos",
      label: "Marca / Motor",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: Scania, Perkins, MWM..."
    },
    {
      id: "pg_usca_controlador",
      section: "Dados técnicos",
      label: "USCA / Controlador",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: DeepSea, ComAp, Komas..."
    },
    {
      id: "pg_potencia_kva",
      section: "Dados técnicos",
      label: "Potência (kVA)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 500"
    },
    {
      id: "pg_tensao_v",
      section: "Dados técnicos",
      label: "Tensão (V)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 380 ou 220"
    },
    {
      id: "pg_qtd_baterias",
      section: "Dados técnicos",
      label: "Quantidade de Baterias",
      type: "options_3",
      options: ["1 Bateria", "2 Baterias"],
      requirePhoto: true
    },
    {
      id: "pg_amperagem_bat",
      section: "Dados técnicos",
      label: "Amperagem das baterias (Ah)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 150"
    },
    {
      id: "pg_tensao_flutuacao_bat",
      section: "Dados técnicos",
      label: "Qual a tensão de flutuação da bateria (V)?",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 27.2 ou 13.6"
    },

    // --- Sistema de Transferência ---
    {
      id: "pg_possui_qta",
      section: "Sistema de transferência",
      label: "Possui QTA (Quadro de Transferência Automática)?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhoto: true
    },
    {
      id: "pg_qta_composicao",
      section: "Sistema de transferência",
      label: "Composição do QTA",
      type: "options_3",
      options: ["Contatoras", "Disjuntores", "Chaves"],
      condition: { questionId: "pg_possui_qta", value: "Sim" },
      requirePhoto: true
    },
    {
      id: "pg_possui_qtm",
      section: "Sistema de transferência",
      label: "Gerador possui QTM?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhotoOnValue: "Sim"
    },

    // --- Inspeção Técnica de Rotina ---
    {
      id: "pg_q1",
      section: "Inspeção técnica",
      label: "1. Acessibilidade à sala desobstruída?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q2",
      section: "Inspeção técnica",
      label: "2. Existe vestígio de insetos ou roedores?",
      type: "tri_state",
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Média"
    },
    {
      id: "pg_q3",
      section: "Inspeção técnica",
      label: "3. Controlador ligado, sem alarme e em automático?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "pg_q5",
      section: "Inspeção técnica",
      label: "4. Gerador sem vazamento aparente?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhotoOnValue: "Não",
      defaultPriority: "Alta"
    },
    {
      id: "pg_q6",
      section: "Inspeção técnica",
      label: "5. Baterias em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q7",
      section: "Inspeção técnica",
      label: "6. Carregador de bateria em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q8",
      section: "Inspeção técnica",
      label: "7. Conferido nível de água do radiador?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q9",
      section: "Inspeção técnica",
      label: "8. Conferido nível de óleo lubrificante?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },

    // Nível do diesel
    {
      id: "pg_nivel_diesel",
      section: "Nível do diesel",
      label: "9. Nível de combustível no tanque",
      type: "options_3",
      options: ["25%", "50%", "75%", "100%"],
      requirePhoto: true,
      required: true
    },

    // --- Intervenções da Preventiva (Com os novos campos solicitados) ---
    {
      id: "pg_int_filtro_oleo",
      section: "Intervenções da Preventiva",
      label: "Foi trocado o filtro de óleo?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Alta"
    },
    {
      id: "pg_int_filtro_oleo_modelo",
      section: "Intervenções da Preventiva",
      label: "Qual modelo do filtro de óleo?",
      type: "text",
      requirePhoto: true,
      required: true,
      placeholder: "Digite o modelo do filtro de óleo..."
    },
    {
      id: "pg_int_filtro_ar",
      section: "Intervenções da Preventiva",
      label: "Foi trocado o filtro de ar?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Alta"
    },
    {
      id: "pg_int_filtro_ar_modelo",
      section: "Intervenções da Preventiva",
      label: "Qual modelo do filtro de ar?",
      type: "text",
      requirePhoto: true,
      required: true,
      placeholder: "Digite o modelo do filtro de ar..."
    },
    {
      id: "pg_int_possui_filtro_agua",
      section: "Intervenções da Preventiva",
      label: "Gerador possui filtro de água?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhotoOnValue: "Sim"
    },
    {
      id: "pg_int_filtro_agua_modelo",
      section: "Intervenções da Preventiva",
      label: "Qual modelo do filtro de água?",
      type: "text",
      condition: { questionId: "pg_int_possui_filtro_agua", value: "Sim" },
      requirePhoto: true,
      placeholder: "Digite o modelo do filtro de água..."
    },
    {
      id: "pg_int_oleo_motor",
      section: "Intervenções da Preventiva",
      label: "Foi trocado o óleo lubrificante do motor?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Alta"
    },
    {
      id: "pg_int_qtd_litros_oleo",
      section: "Intervenções da Preventiva",
      label: "Quantos litros de óleo lubrificante foram colocados no gerador?",
      type: "number",
      requirePhoto: true,
      required: true,
      placeholder: "Ex: 25"
    },
    {
      id: "pg_int_trocou_bateria",
      section: "Intervenções da Preventiva",
      label: "Foi trocada a bateria?",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhotoOnValue: "Sim" // Foto obrigatória se Sim, se Não não precisa
    },
    {
      id: "pg_int_qtd_baterias_trocadas",
      section: "Intervenções da Preventiva",
      label: "Quantas baterias foram trocadas?",
      type: "options_3",
      options: ["1 Bateria", "2 Baterias"],
      condition: { questionId: "pg_int_trocou_bateria", value: "Sim" },
      requirePhoto: true
    },
    {
      id: "pg_int_carregador_bat",
      section: "Intervenções da Preventiva",
      label: "O carregador de bateria está ligado e operando corretamente?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Crítica"
    },

    // --- Medições ---
    {
      id: "pg_corrente_a",
      section: "Medições",
      label: "Corrente fase A (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 210"
    },
    {
      id: "pg_corrente_b",
      section: "Medições",
      label: "Corrente fase B (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 205"
    },
    {
      id: "pg_corrente_c",
      section: "Medições",
      label: "Corrente fase C (A)",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 212"
    },

    // --- Fechamento ---
    {
      id: "pg_obs_fechamento",
      section: "Fechamento",
      label: "Observações gerais da preventiva",
      type: "textarea",
      requirePhoto: true
    },
    {
      id: "pg_usca_auto",
      section: "Fechamento",
      label: "USCA na posição Auto?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      requirePhoto: true,
      requireTextOnObs: true,
      nonConformingValue: "Não",
      defaultPriority: "Crítica"
    }
  ],

  // 3. ROTINA SUBESTAÇÃO
  rotina_subestacao: [
    {
      id: "sub_q1",
      section: "Checklist da Subestação",
      label: "1. A iluminação da subestação está funcionando corretamente?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "sub_q2",
      section: "Checklist da Subestação",
      label: "2. Os fusíveis de média tensão estão em bom estado, sem aquecimento ou oxidação?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "sub_q3",
      section: "Checklist da Subestação",
      label: "3. A subestação possui relé de proteção?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "sub_q4_rele_operando",
      section: "Checklist da Subestação",
      label: "4. O relé está ligado, sem falhas e operando normalmente?",
      type: "tri_state",
      condition: { questionId: "sub_q3", value: "Sim" },
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "sub_q5",
      section: "Checklist da Subestação",
      label: "5. Luvas isolantes presentes e em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "sub_q6",
      section: "Checklist da Subestação",
      label: "6. Tapete de borracha isolante presente e em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "sub_q7",
      section: "Checklist da Subestação",
      label: "7. Sala da subestação limpa e livre de entulhos?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Média"
    },
    {
      id: "sub_q8",
      section: "Checklist da Subestação",
      label: "8. Existe vestígio de insetos, pássaros ou roedores?",
      type: "tri_state",
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Alta"
    },
    {
      id: "sub_obs",
      section: "Fechamento",
      label: "Observações pertinentes da subestação",
      type: "textarea",
      requirePhoto: true
    }
  ],

  // 4. BANCO DE CAPACITORES
  banco_capacitores: [
    {
      id: "cap_foto_porta_fechada",
      section: "Visão geral",
      label: "Foto do banco de capacitores com a porta fechada",
      type: "photo_only",
      requirePhoto: true,
      required: true
    },
    {
      id: "cap_foto_porta_aberta",
      section: "Visão geral",
      label: "Foto do banco de capacitores com a porta aberta",
      type: "photo_only",
      requirePhoto: true,
      required: true
    },
    {
      id: "cap_potencia_kvar",
      section: "Visão geral",
      label: "Potência total do banco em kvar",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 75"
    },
    {
      id: "cap_op_ligado",
      section: "Inspeção operacional",
      label: "1. O banco de capacitores está ligado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "cap_op_automatico",
      section: "Inspeção operacional",
      label: "2. As células capacitivas estão em automático?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "cap_op_temperatura",
      section: "Inspeção operacional",
      label: "3. A temperatura das células e dos cabos está normal?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "cap_op_disjuntores",
      section: "Inspeção operacional",
      label: "4. Os disjuntores estão em bom estado e armados?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "cap_op_contatores",
      section: "Inspeção operacional",
      label: "5. Os contatores estão operando sem ruído ou centelhamento?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "cap_op_celulas_estufamento",
      section: "Inspeção operacional",
      label: "6. As células estão sem estufamento ou vazamento?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "cap_op_ventilador",
      section: "Inspeção operacional",
      label: "7. O ventilador está funcionando corretamente?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Média"
    },
    {
      id: "cap_ef_reativo_medidor",
      section: "Eficiência",
      label: "Reativo registrado no medidor da concessionária",
      type: "photo_only",
      requirePhoto: true,
      required: true
    },
    {
      id: "cap_obs",
      section: "Fechamento",
      label: "Observações pertinentes do banco de capacitores",
      type: "textarea",
      requirePhoto: true
    }
  ],

  // 5. ELÉTRICA
  eletrica: [
    {
      id: "el_quadros_fechados",
      section: "Instalações elétricas",
      label: "Quadros elétricos identificados, fechados e desobstruídos?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "el_sem_aquecimento",
      section: "Instalações elétricas",
      label: "Ausência de sinais de aquecimento ou cheiro de queimado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "el_cabos_bom_estado",
      section: "Instalações elétricas",
      label: "Cabos e conexões aparentes em bom estado?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "el_protecoes_ok",
      section: "Instalações elétricas",
      label: "Dispositivos de proteção sem sinais de avaria?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Crítica"
    },
    {
      id: "el_obs",
      section: "Observações",
      label: "Observações elétricas",
      type: "textarea",
      requirePhoto: true
    }
  ],

  // 6. ILUMINAÇÃO
  iluminacao: [
    {
      id: "il_salao_vendas",
      section: "Sistemas de iluminação",
      label: "Iluminação do salão de vendas funcionando?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Média"
    },
    {
      id: "il_areas_internas",
      section: "Sistemas de iluminação",
      label: "Iluminação das áreas internas funcionando?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Média"
    },
    {
      id: "il_emergencia",
      section: "Sistemas de iluminação",
      label: "Iluminação de emergência em condições de uso?",
      type: "tri_state",
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "il_iluminancia_lux",
      section: "Medições",
      label: "Iluminância média medida em lux",
      type: "number",
      placeholder: "Ex: 450",
      requirePhoto: true
    },
    {
      id: "il_obs",
      section: "Observações",
      label: "Observações de iluminação",
      type: "textarea",
      requirePhoto: true
    }
  ]
};

// Exporta globalmente
if (typeof window !== 'undefined') {
  window.CHECKLIST_MODULES = CHECKLIST_MODULES;
  window.CHECKLIST_QUESTIONS = CHECKLIST_QUESTIONS;
}
