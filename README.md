# 🛒 Checklist de Manutenção - Visita Técnica em Supermercados (PWA)

Aplicação Web Progressiva (PWA) completa, funcional e offline-first desenvolvida em **JavaScript Puro (Vanilla)**, **HTML5** e **CSS3** para a realização de checklists operacionais e preventivos de manutenção durante visitas técnicas em lojas de supermercados.

Desenvolvida especialmente para uso em dispositivos móveis (smartphones), com interface estilo aplicativo nativo, botões amplos, cartões individuais por pergunta, salvamento local via **IndexedDB**, compressão automática de fotografias, captura de geolocalização e geração de relatórios em **PDF (jsPDF)** com compartilhamento direto para o grupo do gerador via **Web Share API**.

---

## 🚀 Recursos e Funcionalidades

1. **Interface de App Nativo**:
   - Cabeçalho fixo com status de rede (online/offline).
   - Menu de navegação inferior (Bottom Navigation) ideal para uso com o polegar.
   - Modo de preenchimento por cartões (uma pergunta por cartão no celular).
   - Barra de progresso com porcentagem em tempo real e contadores de não conformidades.

2. **Funcionamento 100% Offline (PWA)**:
   - Configurado via `manifest.json` e `service-worker.js`.
   - Inclui a biblioteca `jsPDF` localmente em `lib/jspdf.umd.min.js`, garantindo a geração de relatórios PDF sem qualquer conexão à internet.
   - Pode ser instalado diretamente na tela inicial do smartphone ("Adicionar à tela inicial").

3. **Armazenamento e Fotos (IndexedDB)**:
   - Todo o estado da inspeção é salvo localmente no banco de dados IndexedDB (`SupermarketChecklistDB`).
   - Fotos capturadas da câmera ou galeria são automaticamente comprimidas em Canvas (máx. 1024px, JPEG 70%) para otimizar espaço de memória e velocidade do PDF.
   - Suporte completo a salvar rascunhos, continuar inspeções pendentes, duplicar formulários e manter histórico de relatórios concluídos.

4. **Identificação e Módulos de Inspeção**:
   - Cadastro editável de inspetores (`users-data.js`).
   - Cadastro completo de lojas com código, nome, bandeira, endereço, cidade, estado e CEP (`stores-data.js`).
   - Data e hora capturadas automaticamente.
   - Seleção flexível de módulos (o usuário pode executar um, vários ou todos os módulos):
     - **Inspeção de Rotina Gerador**
     - **Preventiva do Gerador**
     - **Inspeção de Rotina Subestação**
     - **Inspeção Banco de Capacitor**
     - **Elétrica**
     - **Iluminação**

5. **Identificação de Anomalias & Geolocalização**:
   - Detecção automática de não conformidades conforme o padrão das respostas.
   - Tela dedicada para revisão e edição das anomalias (descrição, prioridades Crítica/Alta/Média/Baixa, recomendações e fotos).
   - Captura de coordenadas GPS (Latitude, Longitude e Precisão) com tratamento gracioso de recusa ou falha.

6. **Relatório Profissional em PDF & Compartilhamento**:
   - Geração de PDF no padrão A4 com capa, identificação da loja, resumo executivo, tabela consolidada de anomalias ordenada por prioridade, detalhamento dos módulos com destaque em vermelho para não conformidades, fotos e termo de encerramento.
   - Nome automático do arquivo: `RELATORIO_LOJA_[CODIGO]_[DATA]_[RESPONSAVEL].pdf`.
   - Integração com a **Web Share API** (`navigator.share`) para abrir o menu de compartilhamento do celular diretamente (WhatsApp, Telegram, E-mail, etc.). Fallback para download direto caso o compartilhamento não esteja disponível.

---

## 📁 Estrutura de Arquivos

```
supermarket-checklist/
├── index.html            # Estrutura principal da aplicação HTML5 e visualizações
├── styles.css            # Design system e estilos responsivos CSS3
├── app.js                # Controlador principal, estado, IndexedDB e navegação
├── checklist-data.js     # Definições dos módulos, perguntas e regras de validação
├── stores-data.js        # Lista e estrutura de cadastro das lojas
├── users-data.js         # Lista editável dos responsáveis pela visita
├── pdf-generator.js      # Gerador de relatórios em PDF com jsPDF e Web Share API
├── manifest.json         # Manifesto PWA para instalação no dispositivo
├── service-worker.js     # Gerenciamento de cache e modo offline
├── generate_icons.py     # Script utilitário para gerar ícones da aplicação
├── README.md             # Documentação e instruções do projeto
├── icons/                # Ícones da aplicação
│   ├── icon-192.png
│   └── icon-512.png
└── lib/                  # Bibliotecas locais empacotadas
    └── jspdf.umd.min.js  # Biblioteca jsPDF para funcionamento offline
```

---

## 🛠️ Como Executar Localmente

Como o aplicativo utiliza **Service Worker**, **IndexedDB** e **Câmera/GPS**, ele precisa ser servido através de um servidor HTTP local ou via HTTPS (requisito dos navegadores para PWA).

### Opção 1: Usando Python (Recomendado)
No terminal, dentro da pasta do projeto, execute:

```bash
python -m http.server 8000
```
Abra o navegador no smartphone ou computador em `http://localhost:8000`.

### Opção 2: Usando VS Code Live Server
1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.

### Opção 3: Usando Node.js (npx serve)
```bash
npx serve .
```

---

## 🌐 Como Publicar no GitHub Pages

A aplicação foi desenvolvida utilizando exclusivamente **caminhos relativos**, o que permite a publicação direta e sem custos no **GitHub Pages**.

1. Crie um novo repositório no seu GitHub (ex: `supermarket-checklist`).
2. Inicialize o repositório Git local e faça o commit dos arquivos:

```bash
git init
git add .
git commit -m "Initial commit - PWA Checklist Manutenção Supermercados"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/supermarket-checklist.git
git push -u origin main
```

3. No repositório no GitHub:
   - Vá em **Settings** > **Pages**.
   - Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
   - Clique em **Save**.
4. Aguarde alguns instantes. O site estará disponível no endereço público HTTPS:
   `https://SEU-USUARIO.github.io/supermarket-checklist/`

Ao acessar esse link pelo celular (Chrome, Safari, Edge), você poderá usar a opção **"Adicionar à Tela Inicial"** ou **"Instalar Aplicativo"** para usar como app nativo!

---

## ✏️ Personalização

- **Adicionar ou Alterar Inspetores**: Edite a lista no arquivo `users-data.js`.
- **Adicionar Novas Lojas ou Importar Planilhas**: Edite a lista no arquivo `stores-data.js`.
- **Adicionar ou Alterar Perguntas**: Ajuste o schema no arquivo `checklist-data.js`.
