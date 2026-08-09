/**
 * CHECKLIST DATA - Estrutura dos Módulos e Perguntas do Checklist
 * Atualizado conforme planilha de revisão Excel (Revisao_Perguntas_Checklist_Gerador.xlsx)
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
  }
];

// Perguntas por Módulo
const CHECKLIST_QUESTIONS = {
  // 1. ROTINA GERADOR (20 itens)
  rotina_gerador: [
    // --- Dados Técnicos ---
    {
      id: "rg_abrangencia",
      section: "Dados técnicos",
      label: "Esse gerador é parcial ou total?",
      type: "options_3",
      options: ["Total", "Parcial"],
      required: true,
      noPhoto: true
    },
    {
      id: "rg_fabricante",
      section: "Dados técnicos",
      label: "Fabricante do Gerador",
      type: "options_3",
      options: ["Stemac", "Cummins", "MWM", "Atlas Copco", "Maxitrust", "Rodo Agro", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "rg_marca_motor",
      section: "Dados técnicos",
      label: "Marca / Motor",
      type: "options_3",
      options: ["Cummins", "MWM", "Perkins", "Scania", "Volvo Penta", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "rg_fabricante_alternador",
      section: "Dados técnicos",
      label: "Fabricante do alternador",
      type: "options_3",
      options: ["WEG", "Stamford", "Mecc Alte", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "rg_usca_controlador",
      section: "Dados técnicos",
      label: "USCA / Controlador",
      type: "options_3",
      options: ["Deep Sea", "DEIF", "Stemac", "KVA", "Outro"],
      requirePhoto: true,
      allowOtherText: true
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
      type: "options_3",
      options: ["220", "380"],
      requirePhoto: true
    },
    {
      id: "rg_qtd_baterias",
      section: "Dados técnicos",
      label: "Quantidade de Baterias",
      type: "options_3",
      options: ["1 Bateria", "2 Baterias"],
      noPhoto: true
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
      id: "rg_qta_composicao",
      section: "Sistema de transferência",
      label: "Composição do QTA",
      type: "options_3",
      options: ["Contatoras", "Disjuntores", "Chave comutadora (I - 0 - II)"],
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
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q2",
      section: "Checklist de rotina",
      label: "2. Existe vestígio de insetos ou roedores?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Média"
    },
    {
      id: "rg_q5",
      section: "Checklist de rotina",
      label: "4. Gerador possui vazamentos de água ou óleo?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Alta"
    },
    {
      id: "rg_q6",
      section: "Checklist de rotina",
      label: "5. Baterias em bom estado?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q8",
      section: "Checklist de rotina",
      label: "7. Conferido nível de água do radiador?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      noPhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "rg_q9",
      section: "Checklist de rotina",
      label: "8. Conferido nível de óleo lubrificante?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },

    // --- Nível do diesel ---
    {
      id: "rg_nivel_diesel",
      section: "Nível do diesel",
      label: "9. Nível de combustível no tanque",
      type: "options_3",
      options: ["25%", "50%", "75%", "100%"],
      requirePhoto: true,
      required: true
    },

    // --- Medições ---
    {
      id: "rg_corrente_a",
      section: "Medições",
      label: "10. Corrente fase A B C do gerador operando",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: A: 210A, B: 205A, C: 212A"
    },

    // --- Fechamento ---
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
    },
    {
      id: "rg_matricula_gerente",
      section: "Fechamento",
      label: "Qual a matrícula do gerente ou responsável da loja que acompanhou a visita?",
      type: "number",
      required: true,
      noPhoto: true,
      placeholder: "Digite a matrícula (número)"
    }
  ],

  // 2. PREVENTIVA GERADOR (29 itens)
  preventiva_gerador: [
    // --- Dados Técnicos ---
    {
      id: "pg_abrangencia",
      section: "Dados técnicos",
      label: "Esse gerador é total ou parcial?",
      type: "options_3",
      options: ["Total", "Parcial"],
      required: true,
      noPhoto: true
    },
    {
      id: "pg_fabricante",
      section: "Dados técnicos",
      label: "Fabricante do Gerador",
      type: "options_3",
      options: ["Stemac", "Cummins", "MWM", "Atlas Copco", "Maxitrust", "Rodo Agro", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "pg_marca_motor",
      section: "Dados técnicos",
      label: "Modelo e marca motor a combustão",
      type: "options_3",
      options: ["Cummins", "MWM", "Perkins", "Scania", "Volvo Penta", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "pg_fabricante_alternador",
      section: "Dados técnicos",
      label: "Fabricante do alternador",
      type: "options_3",
      options: ["WEG", "Stamford", "Mecc Alte", "Outro"],
      requirePhoto: true,
      allowOtherText: true
    },
    {
      id: "pg_usca_controlador",
      section: "Dados técnicos",
      label: "USCA / Controlador",
      type: "options_3",
      options: ["Deep Sea", "DEIF", "Stemac", "KVA", "Outro"],
      requirePhoto: true,
      allowOtherText: true
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
      type: "options_3",
      options: ["220", "380"],
      requirePhoto: true
    },
    {
      id: "pg_tensao_flutuacao_bat",
      section: "Dados técnicos",
      label: "Tensão de flutuação da bateria (V)?",
      type: "number",
      requirePhoto: true,
      placeholder: "Ex: 27.2 ou 13.6"
    },

    // --- Sistema de Transferência ---
    {
      id: "pg_qta_composicao",
      section: "Sistema de transferência",
      label: "Composição do QTA",
      type: "options_3",
      options: ["Contatoras", "Disjuntores", "Chave comutadora (I - 0 - II)"],
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

    // --- Checklist de Rotina ---
    {
      id: "pg_q1",
      section: "Checklist de rotina",
      label: "1. Acessibilidade à sala desobstruída?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q2",
      section: "Checklist de rotina",
      label: "2. Existe vestígio de insetos ou roedores?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Média"
    },
    {
      id: "pg_q5",
      section: "Checklist de rotina",
      label: "4. Gerador possui vazamentos de água ou óleo?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Sim",
      requirePhotoOnValue: "Sim",
      defaultPriority: "Alta"
    },
    {
      id: "pg_q8",
      section: "Checklist de rotina",
      label: "7. Conferido nível de água do radiador?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      noPhoto: true,
      defaultPriority: "Alta"
    },
    {
      id: "pg_q9",
      section: "Checklist de rotina",
      label: "8. Conferido nível de óleo lubrificante?",
      type: "options_3",
      options: ["Sim", "Não"],
      nonConformingValue: "Não",
      requirePhoto: true,
      defaultPriority: "Alta"
    },

    // --- Nível do diesel ---
    {
      id: "pg_nivel_diesel",
      section: "Nível do diesel",
      label: "9. Nível de combustível no tanque",
      type: "options_3",
      options: ["25%", "50%", "75%", "100%"],
      requirePhoto: true,
      required: true
    },

    // --- Medições ---
    {
      id: "pg_corrente_a",
      section: "Medições",
      label: "10. Corrente fase A B C do gerador operando",
      type: "text",
      requirePhoto: true,
      placeholder: "Ex: A: 210A, B: 205A, C: 212A"
    },

    // --- Intervenções da Preventiva ---
    {
      id: "pg_int_filtro_oleo",
      section: "Intervenções da Preventiva",
      label: "Foi trocado o filtro de óleo?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      noPhoto: true,
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
      placeholder: "Digite o modelo do filtro de óleo..."
    },
    {
      id: "pg_int_filtro_ar",
      section: "Intervenções da Preventiva",
      label: "Foi trocado o filtro de ar?",
      type: "options_3",
      options: ["Sim", "Não", "Observação"],
      noPhoto: true,
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
      noPhoto: true,
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
      placeholder: "Ex: 25"
    },
    {
      id: "pg_int_qtd_baterias_trocadas",
      section: "Intervenções da Preventiva",
      label: "Quantas baterias foram trocadas?",
      type: "options_3",
      options: ["Nenhuma", "1 Bateria", "2 Baterias"],
      requirePhotoOnNonValue: "Nenhuma" // Foto obrigatória se trocou 1 ou 2 baterias
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

    // --- Fechamento ---
    {
      id: "pg_obs_fechamento",
      section: "Fechamento",
      label: "Observações adicional da preventiva",
      type: "options_3",
      options: ["Sim", "Não"],
      requirePhotoOnValue: "Sim",
      requireTextOnValue: "Sim"
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
    },
    {
      id: "pg_matricula_gerente",
      section: "Fechamento",
      label: "Qual a matrícula do gerente ou responsável da loja que acompanhou a visita?",
      type: "number",
      required: true,
      noPhoto: true,
      placeholder: "Digite a matrícula (número)"
    }
  ],

  // 3. ROTINA SUBESTAÇÃO (9 itens)
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
    },
    {
      id: "sub_matricula_gerente",
      section: "Fechamento",
      label: "Qual a matrícula do gerente ou responsável da loja que acompanhou a visita?",
      type: "number",
      required: true,
      noPhoto: true,
      placeholder: "Digite a matrícula (número)"
    }
  ],

  // 4. BANCO DE CAPACITORES (12 itens)
  banco_capacitores: [
    {
      id: "cap_foto_porta_fechada",
      section: "Visão geral",
      label: "Foto do banco de capacitores com a porta fechada",
      type: "photo_only",
      requirePhoto: true
    },
    {
      id: "cap_foto_porta_aberta",
      section: "Visão geral",
      label: "Foto do banco de capacitores com a porta aberta",
      type: "photo_only",
      requirePhoto: true
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
      id: "cap_tipo_controle",
      section: "Visão geral",
      label: "Banco capacitor com controlador eletrônico ou timer?",
      type: "options_3",
      options: ["Controlador eletrônico", "Timer"],
      required: true,
      noPhoto: true
    },
    {
      id: "cap_ctrl_modelo_marca",
      section: "Visão geral",
      label: "Qual modelo e marca do controlador?",
      type: "text",
      placeholder: "Digite a marca e modelo do controlador...",
      condition: { questionId: "cap_tipo_controle", value: "Controlador eletrônico" },
      required: true,
      requirePhoto: true
    },
    {
      id: "cap_timer_detalhes",
      section: "Visão geral",
      label: "Qual a hora que o timer liga e desliga e quais os dias da semana ele funciona?",
      type: "textarea",
      placeholder: "Ex: Liga às 08:00 e desliga às 22:00, de Segunda a Sábado...",
      condition: { questionId: "cap_tipo_controle", value: "Timer" },
      required: true,
      requirePhoto: true
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
      requirePhoto: true
    },
    {
      id: "cap_obs",
      section: "Fechamento",
      label: "Observações pertinentes do banco de capacitores",
      type: "textarea",
      requirePhoto: true
    },
    {
      id: "cap_matricula_gerente",
      section: "Fechamento",
      label: "Qual a matrícula do gerente ou responsável da loja que acompanhou a visita?",
      type: "number",
      required: true,
      noPhoto: true,
      placeholder: "Digite a matrícula (número)"
    }
  ]
};

// Exporta globalmente
if (typeof window !== 'undefined') {
  window.CHECKLIST_MODULES = CHECKLIST_MODULES;
  window.CHECKLIST_QUESTIONS = CHECKLIST_QUESTIONS;
}
