/**
 * APP.JS - Controlador Principal da Aplicação PWA de Checklist de Manutenção
 */

class SupermarketChecklistApp {
  constructor() {
    this.db = null;
    this.currentInspection = null;
    this.currentModuleIndex = 0;
    this.currentQuestionIndex = 0;
    this.activeView = 'new-inspection';
    this.pdfGenerator = new window.ChecklistPDFGenerator();

    this.init();
  }

  /**
   * Inicialização do app, eventos e IndexedDB
   */
  async init() {
    await this.initIndexedDB();
    this.setupEventListeners();
    this.setupNetworkStatus();
    this.setupPWAInstall();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);

    // Inicia diretamente na tela funcional de inspeção
    this.startNewInspectionFlow();
  }

  /**
   * Inicialização do IndexedDB (SupermarketChecklistDB)
   */
  initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SupermarketChecklistDB', 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('inspections')) {
          const store = db.createObjectStore('inspections', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log("IndexedDB inicializado com sucesso.");
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error("Erro ao abrir IndexedDB:", e);
        reject(e);
      };
    });
  }

  /**
   * Atualiza relógio em tempo real
   */
  updateClock() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');

    const dateElem = document.getElementById('auto-date');
    const timeElem = document.getElementById('auto-time');

    if (dateElem) dateElem.textContent = dateStr;
    if (timeElem) timeElem.textContent = timeStr;
  }

  /**
   * Registra escutadores de eventos da interface
   */
  setupEventListeners() {
    document.getElementById('btn-new-inspection')?.addEventListener('click', () => this.startNewInspectionFlow());
    document.getElementById('btn-start-inspection-nav')?.addEventListener('click', () => this.startNewInspectionFlow());
    document.getElementById('btn-dashboard-nav')?.addEventListener('click', () => this.showView('dashboard'));
    document.getElementById('btn-drafts-nav')?.addEventListener('click', () => this.showView('dashboard'));
    document.getElementById('btn-clear-all-data')?.addEventListener('click', () => this.confirmClearAllData());

    // Tela de Identificação
    document.getElementById('select-user')?.addEventListener('change', (e) => this.updateInspectionUser(e.target.value));
    document.getElementById('select-store')?.addEventListener('change', (e) => this.onStoreSelected(e.target.value));

    // Tela da Inspeção Ativa (Cartões)
    document.getElementById('btn-prev-question')?.addEventListener('click', () => this.navigateQuestion(-1));
    document.getElementById('btn-next-question')?.addEventListener('click', () => this.navigateQuestion(1));
    document.getElementById('btn-save-draft')?.addEventListener('click', () => this.saveCurrentDraft(true));
    document.getElementById('btn-finish-checklist')?.addEventListener('click', () => this.prepareAnomaliesOrFinish());

    // Tela de Revisão Final / Opções de PDF
    document.getElementById('btn-review-back')?.addEventListener('click', () => this.showView('inspection-active'));
    document.getElementById('btn-review-save-draft')?.addEventListener('click', () => this.saveCurrentDraft(true));
    
    document.getElementById('btn-generate-pdf-share')?.addEventListener('click', () => this.sharePDFOnly());
    document.getElementById('btn-download-pdf-only')?.addEventListener('click', () => this.downloadPDFOnly());
    document.getElementById('btn-share-pdf-only')?.addEventListener('click', () => this.sharePDFOnly());
    document.getElementById('btn-review-new-visit')?.addEventListener('click', () => this.startNewInspectionFlow());

    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });
  }

  /**
   * Monitora estado online/offline
   */
  setupNetworkStatus() {
    const updateBanner = () => {
      const banner = document.getElementById('offline-banner');
      if (banner) {
        if (navigator.onLine) {
          banner.classList.add('hidden');
        } else {
          banner.classList.remove('hidden');
        }
      }
    };

    window.addEventListener('online', updateBanner);
    window.addEventListener('offline', updateBanner);
    updateBanner();
  }

  /**
   * Monitora e lida com a instalação do PWA
   */
  setupPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.addEventListener('click', () => {
          installBtn.classList.add('hidden');
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('Usuário aceitou a instalação do PWA');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  }

  /**
   * Alterna entre as telas da aplicação
   */
  showView(viewId) {
    this.activeView = viewId;
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.add('hidden');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.remove('hidden');
      window.scrollTo(0, 0);
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    if (viewId === 'new-inspection' || viewId === 'inspection-active') {
      document.getElementById('btn-start-inspection-nav')?.classList.add('active');
    } else if (viewId === 'dashboard') {
      document.getElementById('btn-dashboard-nav')?.classList.add('active');
    }

    if (viewId === 'dashboard') {
      this.renderDashboardLists();
    }
  }

  /**
   * Ordena a lista de lojas: D primeiro em ordem crescente, depois L em ordem crescente, depois outras
   */
  getSortedStores() {
    const stores = window.STORES_DATA || [];
    return [...stores].sort((a, b) => {
      const codeA = String(a.code || '').trim().toUpperCase();
      const codeB = String(b.code || '').trim().toUpperCase();

      const charA = codeA[0] || '';
      const charB = codeB[0] || '';

      const groupA = charA === 'D' ? 0 : (charA === 'L' ? 1 : 2);
      const groupB = charB === 'D' ? 0 : (charB === 'L' ? 1 : 2);

      if (groupA !== groupB) {
        return groupA - groupB;
      }

      const matchA = codeA.match(/\d+/);
      const matchB = codeB.match(/\d+/);
      const numA = matchA ? parseInt(matchA[0], 10) : 999999;
      const numB = matchB ? parseInt(matchB[0], 10) : 999999;

      if (numA !== numB) {
        return numA - numB;
      }

      return codeA.localeCompare(codeB, 'pt-BR', { numeric: true });
    });
  }

  /**
   * Inicia fluxo de nova inspeção diretamente na tela principal
   */
  startNewInspectionFlow() {
    this.currentInspection = {
      id: 'INSP_' + Date.now(),
      user: '',
      storeId: '',
      storeInfo: null,
      dateTime: new Date().toISOString(),
      selectedModules: [],
      answers: {},
      anomalies: [],
      geolocation: null,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const selectUser = document.getElementById('select-user');
    if (selectUser) {
      selectUser.innerHTML = '<option value="">-- Selecione o Responsável --</option>';
      (window.USERS_DATA || []).forEach(u => {
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u;
        selectUser.appendChild(opt);
      });
    }

    const selectStore = document.getElementById('select-store');
    if (selectStore) {
      selectStore.innerHTML = '<option value="">-- Selecione a Loja --</option>';
      const sortedStores = this.getSortedStores();
      sortedStores.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `[${s.code}] ${s.name}`;
        selectStore.appendChild(opt);
      });
    }

    document.getElementById('store-details-card')?.classList.add('hidden');
    this.renderModuleSelectionCards();

    this.showView('new-inspection');
  }

  /**
   * Quando uma loja é selecionada
   */
  onStoreSelected(storeId) {
    if (!this.currentInspection) return;

    const store = (window.STORES_DATA || []).find(s => s.id === storeId);
    if (store) {
      this.currentInspection.storeId = store.id;
      this.currentInspection.storeInfo = store;

      const detailsCard = document.getElementById('store-details-card');
      if (detailsCard) {
        detailsCard.classList.remove('hidden');
        document.getElementById('store-detail-code').textContent = store.code;
        document.getElementById('store-detail-name').textContent = store.name;
        document.getElementById('store-detail-address').textContent = `${store.address}, ${store.city} - ${store.state}`;
      }
    } else {
      this.currentInspection.storeId = '';
      this.currentInspection.storeInfo = null;
      document.getElementById('store-details-card')?.classList.add('hidden');
    }
  }

  /**
   * Atualiza usuário na inspeção atual
   */
  updateInspectionUser(userVal) {
    if (this.currentInspection) {
      this.currentInspection.user = userVal;
    }
  }

  /**
   * Renderiza os cartões de seleção/início direto de módulos
   */
  renderModuleSelectionCards() {
    const container = document.getElementById('modules-selection-grid');
    if (!container) return;

    container.innerHTML = '';

    (window.CHECKLIST_MODULES || []).forEach(mod => {
      const card = document.createElement('div');
      card.className = 'module-select-card';
      card.dataset.moduleId = mod.id;

      card.innerHTML = `
        <div class="module-card-header">
          <span class="module-card-icon">📋</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">Iniciar ➔</span>
        </div>
        <h3 class="module-card-title">${mod.name}</h3>
        <p class="module-card-desc">${mod.description}</p>
      `;

      card.addEventListener('click', () => {
        this.directStartModule(mod.id);
      });

      container.appendChild(card);
    });
  }

  /**
   * Inicia a inspeção diretamente ao clicar em um módulo
   */
  directStartModule(modId) {
    if (!this.currentInspection.user) {
      alert("Por favor, selecione o responsável pela visita antes de clicar no módulo.");
      return;
    }

    if (!this.currentInspection.storeId || !this.currentInspection.storeInfo) {
      alert("Por favor, selecione a loja a ser inspecionada antes de clicar no módulo.");
      return;
    }

    if (!this.currentInspection.selectedModules.includes(modId)) {
      this.currentInspection.selectedModules.push(modId);
    }

    if (!this.currentInspection.answers[modId]) {
      this.currentInspection.answers[modId] = {};
    }

    this.currentModuleIndex = 0;
    this.currentQuestionIndex = 0;

    const activeQuestions = this.getActiveQuestionsList();
    const firstQIdx = activeQuestions.findIndex(q => q.moduleId === modId);

    if (firstQIdx >= 0) {
      this.currentQuestionIndex = firstQIdx;
    }

    this.renderActiveQuestionCard();
    this.showView('inspection-active');
  }

  /**
   * Retorna todas as perguntas ativas dos módulos selecionados
   */
  getActiveQuestionsList() {
    const list = [];
    if (!this.currentInspection) return list;

    (this.currentInspection.selectedModules || []).forEach(modId => {
      const questions = (window.CHECKLIST_QUESTIONS || {})[modId] || [];
      questions.forEach(q => {
        if (q.condition) {
          const parentAns = this.currentInspection.answers[modId]?.[q.condition.questionId];
          if (!parentAns || parentAns.value !== q.condition.value) {
            return;
          }
        }
        list.push({ moduleId: modId, question: q });
      });
    });

    return list;
  }

  /**
   * Renderiza a pergunta atual em formato de cartão mobile
   */
  renderActiveQuestionCard() {
    const activeQuestions = this.getActiveQuestionsList();
    if (activeQuestions.length === 0) {
      alert("Nenhuma pergunta encontrada para os módulos selecionados.");
      return;
    }

    if (this.currentQuestionIndex >= activeQuestions.length) {
      this.currentQuestionIndex = activeQuestions.length - 1;
    }
    if (this.currentQuestionIndex < 0) {
      this.currentQuestionIndex = 0;
    }

    const currentItem = activeQuestions[this.currentQuestionIndex];
    const { moduleId, question } = currentItem;
    const modInfo = (window.CHECKLIST_MODULES || []).find(m => m.id === moduleId) || { name: moduleId };

    // Atualiza barra de progresso
    this.updateProgressBar(activeQuestions);

    const container = document.getElementById('active-question-container');
    if (!container) return;

    const savedAns = this.currentInspection.answers[moduleId]?.[question.id] || { value: '', justification: '', photos: [] };

    // Obrigatoriedade de foto condicional
    const isPhotoMandatory = !question.noPhoto && (
      (question.requirePhoto && !question.requirePhotoOnValue) ||
      (question.requirePhotoOnValue && savedAns.value === question.requirePhotoOnValue)
    );

    container.innerHTML = `
      <div class="question-card">
        <div class="question-card-header">
          <span class="badge badge-module">${modInfo.shortName}</span>
          <span class="badge badge-section">${question.section || 'Inspeção'}</span>
          <span class="question-counter">${this.currentQuestionIndex + 1} de ${activeQuestions.length}</span>
        </div>

        <h3 class="question-title">${question.label}</h3>

        <div class="question-body">
          ${this.renderQuestionInputControls(question, savedAns)}
        </div>

        <!-- Área de Fotos (Oculta se noPhoto for true) -->
        ${question.noPhoto ? '' : `
          <div class="photo-upload-section">
            <label class="photo-section-label">
              📸 Fotografias ${isPhotoMandatory ? '<span class="required-asterisk">* (Obrigatória)</span>' : '(Opcional/Recomendada)'}
            </label>

            <div class="photo-grid" id="photo-grid-${question.id}">
              ${(savedAns.photos || []).map((img, idx) => `
                <div class="photo-thumb">
                  <img src="${img}" alt="Foto ${idx + 1}" onclick="window.app.previewImage('${img}')">
                  <button type="button" class="btn-remove-photo" onclick="window.app.removePhoto('${moduleId}', '${question.id}', ${idx})">✕</button>
                </div>
              `).join('')}
            </div>

            <div class="photo-actions">
              <label class="btn btn-secondary btn-touch">
                📷 Tirar Foto / Galeria
                <input type="file" accept="image/*" capture="environment" style="display:none" onchange="window.app.handlePhotoUpload(event, '${moduleId}', '${question.id}')">
              </label>
            </div>
          </div>
        `}
      </div>
    `;

    document.getElementById('btn-prev-question').disabled = (this.currentQuestionIndex === 0);
    document.getElementById('btn-next-question').textContent = (this.currentQuestionIndex === activeQuestions.length - 1) ? 'Finalizar Inspeção ➔' : 'Próxima ➔';
  }

  /**
   * Renderiza os controles de entrada (Sempre usando botões lado a lado para opções)
   */
  renderQuestionInputControls(q, ans) {
    const val = ans.value;

    if (q.type === 'tri_state') {
      return `
        <div class="option-buttons-group">
          <button type="button" class="btn-opt ${val === 'Sim' ? 'active-sim' : ''}" onclick="window.app.setQuestionAnswer('${q.id}', 'Sim')">Sim</button>
          <button type="button" class="btn-opt ${val === 'Não' ? 'active-nao' : ''}" onclick="window.app.setQuestionAnswer('${q.id}', 'Não')">Não</button>
          <button type="button" class="btn-opt ${val === 'Não se aplica' ? 'active-na' : ''}" onclick="window.app.setQuestionAnswer('${q.id}', 'Não se aplica')">Não se aplica</button>
        </div>

        <div class="conditional-field ${ans.isNonConforming || ans.justification ? '' : 'hidden'}" id="cond-field-${q.id}">
          <label class="field-label">Descrição / Justificativa ${ans.isNonConforming ? '<span class="required-asterisk">* (Obrigatória para não conformidade)</span>' : ''}</label>
          <textarea class="form-control" rows="2" placeholder="Descreva o problema ou justificativa..." onchange="window.app.setQuestionJustification('${q.id}', this.value)">${ans.justification || ''}</textarea>
        </div>
      `;
    }

    if (q.type === 'options_3' || q.type === 'select') {
      const opts = q.options || ["Sim", "Não", "Observação"];
      return `
        <div class="option-buttons-group">
          ${opts.map(opt => `
            <button type="button" class="btn-opt ${val === opt ? 'active-sim' : ''}" onclick="window.app.setQuestionAnswer('${q.id}', '${opt}')">${opt}</button>
          `).join('')}
        </div>

        <div class="conditional-field ${(ans.isNonConforming || val === 'Observação' || ans.justification) ? '' : 'hidden'}" id="cond-field-${q.id}">
          <label class="field-label">Descrição / Observação ${q.requireTextOnObs && val === 'Observação' ? '<span class="required-asterisk">* (Obrigatória)</span>' : ''}</label>
          <textarea class="form-control" rows="2" placeholder="Descreva a observação ou justificativa..." onchange="window.app.setQuestionJustification('${q.id}', this.value)">${ans.justification || ''}</textarea>
        </div>
      `;
    }

    if (q.type === 'number') {
      return `
        <input type="number" step="any" class="form-control" placeholder="${q.placeholder || ''}" value="${val || ''}" onchange="window.app.setQuestionAnswer('${q.id}', this.value)">
      `;
    }

    if (q.type === 'textarea') {
      return `
        <textarea class="form-control" rows="3" placeholder="${q.placeholder || 'Observações...'}" onchange="window.app.setQuestionAnswer('${q.id}', this.value)">${val || ''}</textarea>
      `;
    }

    if (q.type === 'text') {
      return `
        <input type="text" class="form-control" placeholder="${q.placeholder || ''}" value="${val || ''}" onchange="window.app.setQuestionAnswer('${q.id}', this.value)">
      `;
    }

    if (q.type === 'photo_only') {
      return `
        <p class="text-muted">Por favor, registre a fotografia obrigatória abaixo para concluir este item.</p>
      `;
    }

    return '';
  }

  /**
   * Define resposta para uma pergunta
   */
  setQuestionAnswer(questionId, value) {
    const activeQuestions = this.getActiveQuestionsList();
    const item = activeQuestions.find(q => q.question.id === questionId);
    if (!item) return;

    const { moduleId, question } = item;
    if (!this.currentInspection.answers[moduleId]) {
      this.currentInspection.answers[moduleId] = {};
    }

    const prevAns = this.currentInspection.answers[moduleId][questionId] || { photos: [] };
    const isNC = (question.nonConformingValue && value === question.nonConformingValue);

    this.currentInspection.answers[moduleId][questionId] = {
      ...prevAns,
      questionId,
      label: question.label,
      value,
      isNonConforming: isNC
    };

    this.syncAnomalies();
    this.renderActiveQuestionCard();
  }

  /**
   * Define justificativa/observação da pergunta
   */
  setQuestionJustification(questionId, textVal) {
    const activeQuestions = this.getActiveQuestionsList();
    const item = activeQuestions.find(q => q.question.id === questionId);
    if (!item) return;

    const { moduleId } = item;
    if (!this.currentInspection.answers[moduleId][questionId]) {
      this.currentInspection.answers[moduleId][questionId] = { value: '', photos: [] };
    }

    this.currentInspection.answers[moduleId][questionId].justification = textVal;
    this.syncAnomalies();
  }

  /**
   * Faz upload e compressão de fotos via canvas
   */
  async handlePhotoUpload(event, moduleId, questionId) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const compressedBase64 = await this.compressImage(file);
      if (!this.currentInspection.answers[moduleId][questionId]) {
        this.currentInspection.answers[moduleId][questionId] = { value: '', photos: [] };
      }

      if (!this.currentInspection.answers[moduleId][questionId].photos) {
        this.currentInspection.answers[moduleId][questionId].photos = [];
      }

      this.currentInspection.answers[moduleId][questionId].photos.push(compressedBase64);
      this.syncAnomalies();
      this.renderActiveQuestionCard();
    } catch (err) {
      alert("Erro ao processar imagem: " + err.message);
    }
  }

  /**
   * Remove uma fotografia
   */
  removePhoto(moduleId, questionId, photoIdx) {
    const ans = this.currentInspection.answers[moduleId]?.[questionId];
    if (ans && ans.photos) {
      ans.photos.splice(photoIdx, 1);
      this.syncAnomalies();
      this.renderActiveQuestionCard();
    }
  }

  /**
   * Visualiza imagem em modal
   */
  previewImage(imgSrc) {
    const modal = document.getElementById('modal-photo-preview');
    const imgElem = document.getElementById('preview-modal-img');
    if (modal && imgElem) {
      imgElem.src = imgSrc;
      modal.classList.remove('hidden');
    }
  }

  /**
   * Comprime imagem usando Canvas para otimizar espaço no IndexedDB e PDF
   */
  compressImage(file, maxWidth = 1024, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  /**
   * Navega entre as perguntas (próxima/anterior)
   */
  navigateQuestion(delta) {
    const activeQuestions = this.getActiveQuestionsList();
    const currentItem = activeQuestions[this.currentQuestionIndex];

    if (delta > 0 && currentItem) {
      const { moduleId, question } = currentItem;
      const ans = this.currentInspection.answers[moduleId]?.[question.id];

      if (question.required && (!ans || !ans.value)) {
        alert(`O campo "${question.label}" é obrigatório.`);
        return;
      }

      if (ans && ans.isNonConforming && !ans.justification) {
        alert(`Toda resposta não conforme exige uma descrição/justificativa obrigatória.`);
        return;
      }

      // Validação de foto obrigatória
      if (!question.noPhoto) {
        if (question.requirePhotoOnValue) {
          if (ans && ans.value === question.requirePhotoOnValue && (!ans.photos || ans.photos.length === 0)) {
            alert(`Fotografia é obrigatória quando a resposta for "${question.requirePhotoOnValue}".`);
            return;
          }
        } else if (question.requirePhoto) {
          if (!ans || !ans.photos || ans.photos.length === 0) {
            alert(`Este item exige pelo menos uma fotografia obrigatória.`);
            return;
          }
        }
      }
    }

    this.currentQuestionIndex += delta;

    if (this.currentQuestionIndex >= activeQuestions.length) {
      this.prepareAnomaliesOrFinish();
    } else {
      this.renderActiveQuestionCard();
    }
  }

  /**
   * Atualiza a barra de progresso
   */
  updateProgressBar(activeQuestions) {
    const total = activeQuestions.length;
    let answered = 0;
    let nonConformities = 0;

    activeQuestions.forEach(item => {
      const ans = this.currentInspection.answers[item.moduleId]?.[item.question.id];
      if (ans && (ans.value || (ans.photos && ans.photos.length > 0))) {
        answered++;
      }
      if (ans && ans.isNonConforming) {
        nonConformities++;
      }
    });

    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

    document.getElementById('progress-percentage').textContent = `${percent}%`;
    document.getElementById('progress-bar-fill').style.width = `${percent}%`;
    document.getElementById('stat-answered-count').textContent = answered;
    document.getElementById('stat-total-count').textContent = total;
    document.getElementById('stat-nc-count').textContent = nonConformities;
  }

  /**
   * Sincroniza automaticamente as não conformidades com o nome exato da pergunta e resposta
   */
  syncAnomalies() {
    if (!this.currentInspection) return;

    const existingMap = new Map((this.currentInspection.anomalies || []).map(a => [a.questionId, a]));
    const newAnomalies = [];
    let seq = 1;

    (this.currentInspection.selectedModules || []).forEach(modId => {
      const modInfo = (window.CHECKLIST_MODULES || []).find(m => m.id === modId) || { name: modId };
      const modAnswers = this.currentInspection.answers[modId] || {};

      Object.keys(modAnswers).forEach(qId => {
        const ans = modAnswers[qId];
        if (ans && ans.isNonConforming) {
          const prevAnom = existingMap.get(qId);
          const qDef = ((window.CHECKLIST_QUESTIONS || {})[modId] || []).find(q => q.id === qId);

          const descText = ans.justification || `Não conformidade identificada no item: ${ans.label}`;

          newAnomalies.push({
            id: 'ANOM_' + qId,
            questionId: qId,
            sequence: seq++,
            area: modId,
            moduleName: modInfo.name,
            subarea: qDef?.section || 'Checklist',
            question: ans.label,
            answerValue: ans.value,
            location: this.currentInspection.storeInfo ? this.currentInspection.storeInfo.name : 'Loja',
            description: descText,
            priority: prevAnom?.priority || qDef?.defaultPriority || 'Alta',
            recommendation: prevAnom?.recommendation || `Providenciar manutenção/adequação técnica do item "${ans.label}".`,
            photos: ans.photos || []
          });
        }
      });
    });

    this.currentInspection.anomalies = newAnomalies;
  }

  /**
   * Finaliza o percurso e segue para a revisão/GPS
   */
  prepareAnomaliesOrFinish() {
    this.syncAnomalies();
    this.captureGeoAndProceedToReview();
  }

  /**
   * Captura geolocalização e segue para a revisão final
   */
  captureGeoAndProceedToReview() {
    if (!navigator.geolocation) {
      this.currentInspection.geolocation = { error: 'Geolocalização não suportada no navegador' };
      this.renderReviewScreen();
      this.showView('review');
      return;
    }

    const modalGeo = document.getElementById('modal-geo-loading');
    if (modalGeo) modalGeo.classList.remove('hidden');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (modalGeo) modalGeo.classList.add('hidden');
        this.currentInspection.geolocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date(pos.timestamp).toISOString()
        };
        this.renderReviewScreen();
        this.showView('review');
      },
      (err) => {
        if (modalGeo) modalGeo.classList.add('hidden');
        console.warn("Falha na geolocalização:", err);
        this.currentInspection.geolocation = { error: err.message || 'Permissão negada' };
        this.renderReviewScreen();
        this.showView('review');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  /**
   * Renderiza a tela de Revisão Final
   */
  renderReviewScreen() {
    const stats = this.calculateStats();
    this.currentInspection.stats = stats;

    const store = this.currentInspection.storeInfo || {};
    const geo = this.currentInspection.geolocation;

    document.getElementById('rev-user').textContent = this.currentInspection.user || 'N/A';
    document.getElementById('rev-store').textContent = `[${store.code || 'N/A'}] ${store.name || 'N/A'}`;
    document.getElementById('rev-address').textContent = `${store.address || ''}, ${store.city || ''} - ${store.state || ''}`;
    document.getElementById('rev-datetime').textContent = new Date(this.currentInspection.dateTime).toLocaleString('pt-BR');

    if (geo && geo.latitude) {
      document.getElementById('rev-geo').textContent = `Lat: ${geo.latitude.toFixed(5)}, Long: ${geo.longitude.toFixed(5)} (Acc: ${Math.round(geo.accuracy)}m)`;
    } else {
      document.getElementById('rev-geo').textContent = `Não disponibilizada (${geo?.error || 'Indisponível'})`;
    }

    document.getElementById('rev-modules').textContent = (this.currentInspection.selectedModules || []).map(id => {
      const m = (window.CHECKLIST_MODULES || []).find(x => x.id === id);
      return m ? m.shortName : id;
    }).join(', ');

    // Estatísticas
    document.getElementById('rev-stat-total').textContent = stats.total;
    document.getElementById('rev-stat-conformes').textContent = stats.conformes;
    document.getElementById('rev-stat-nc').textContent = stats.naoConformes;
    document.getElementById('rev-stat-na').textContent = stats.na;
    document.getElementById('rev-stat-photos').textContent = stats.photosCount;
  }

  /**
   * Calcula estatísticas consolidadas da inspeção
   */
  calculateStats() {
    let total = 0;
    let conformes = 0;
    let naoConformes = 0;
    let na = 0;
    let photosCount = 0;

    const anomaliesPrio = { critica: 0, alta: 0, media: 0, baixa: 0 };

    (this.currentInspection.selectedModules || []).forEach(modId => {
      const answers = this.currentInspection.answers[modId] || {};
      Object.keys(answers).forEach(qId => {
        const a = answers[qId];
        if (a) {
          total++;
          if (a.value === 'Não se aplica') {
            na++;
          } else if (a.isNonConforming) {
            naoConformes++;
          } else {
            conformes++;
          }

          if (a.photos) {
            photosCount += a.photos.length;
          }
        }
      });
    });

    (this.currentInspection.anomalies || []).forEach(anom => {
      const prio = (anom.priority || '').toLowerCase();
      if (prio.includes('crít') || prio.includes('crit')) anomaliesPrio.critica++;
      else if (prio.includes('alta')) anomaliesPrio.alta++;
      else if (prio.includes('méd') || prio.includes('med')) anomaliesPrio.media++;
      else if (prio.includes('baix')) anomaliesPrio.baixa++;
    });

    return { total, conformes, naoConformes, na, photosCount, anomalies: anomaliesPrio };
  }

  /**
   * Salva rascunho no IndexedDB
   */
  async saveCurrentDraft(showFeedback = false) {
    if (!this.currentInspection) return;

    this.currentInspection.updatedAt = new Date().toISOString();
    if (!this.currentInspection.status) this.currentInspection.status = 'draft';

    try {
      const tx = this.db.transaction('inspections', 'readwrite');
      const store = tx.objectStore('inspections');
      await store.put(this.currentInspection);

      if (showFeedback) {
        alert("Rascunho salvo com sucesso no dispositivo!");
      }
      this.renderDashboardLists();
    } catch (err) {
      console.error("Erro ao salvar rascunho:", err);
      alert("Erro ao salvar rascunho: " + err.message);
    }
  }

  /**
   * Exibe indicador visual durante a compilação do PDF
   */
  showPdfLoadingModal(show) {
    let modal = document.getElementById('modal-pdf-compiling');
    if (!modal && show) {
      modal = document.createElement('div');
      modal.id = 'modal-pdf-compiling';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-content text-center">
          <h3 style="color: var(--color-primary); margin-bottom: 10px;">📄 Compilando Relatório em PDF</h3>
          <p class="text-muted">Processando fotos e formatando o documento A4... Aguarde um instante.</p>
        </div>
      `;
      document.body.appendChild(modal);
    }
    if (modal) {
      if (show) modal.classList.remove('hidden');
      else modal.classList.add('hidden');
    }
  }

  /**
   * Salva / Baixa o PDF diretamente no celular/computador
   */
  async downloadPDFOnly() {
    this.showPdfLoadingModal(true);
    setTimeout(async () => {
      try {
        this.currentInspection.status = 'completed';
        await this.saveCurrentDraft(false);

        const result = await this.pdfGenerator.generatePDF(this.currentInspection, false);
        this.showPdfLoadingModal(false);
        alert(`Relatório em PDF salvo no dispositivo: ${result.fileName}`);
      } catch (err) {
        this.showPdfLoadingModal(false);
        console.error("Erro ao gerar PDF:", err);
        alert("Erro ao gerar PDF: " + err.message);
      }
    }, 100);
  }

  /**
   * Envia / Compartilha o PDF via WhatsApp/E-mail ou faz Download Fallback
   */
  async sharePDFOnly() {
    this.showPdfLoadingModal(true);
    setTimeout(async () => {
      try {
        this.currentInspection.status = 'completed';
        await this.saveCurrentDraft(false);

        const result = await this.pdfGenerator.generatePDF(this.currentInspection, true);
        this.showPdfLoadingModal(false);
        if (result && result.shared) {
          alert("Relatório compartilhado com sucesso!");
        } else {
          alert(`Relatório em PDF gerado com sucesso: ${result.fileName}`);
        }
      } catch (err) {
        this.showPdfLoadingModal(false);
        console.error("Erro ao gerar/compartilhar PDF:", err);
        alert("Erro ao gerar PDF: " + err.message);
      }
    }, 100);
  }

  /**
   * Renderiza as listas de rascunhos e concluídos no Dashboard
   */
  async renderDashboardLists() {
    if (!this.db) return;

    try {
      const tx = this.db.transaction('inspections', 'readonly');
      const store = tx.objectStore('inspections');
      const request = store.getAll();

      request.onsuccess = () => {
        const all = request.result || [];
        const drafts = all.filter(i => i.status === 'draft').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const completed = all.filter(i => i.status === 'completed').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // Rascunhos
        const draftsContainer = document.getElementById('drafts-list');
        if (draftsContainer) {
          if (drafts.length === 0) {
            draftsContainer.innerHTML = '<p class="text-muted text-center p-3">Nenhum rascunho em andamento.</p>';
          } else {
            draftsContainer.innerHTML = drafts.map(i => `
              <div class="list-item-card">
                <div class="list-item-main">
                  <h4 class="list-item-title">[${i.storeInfo?.code || 'N/A'}] ${i.storeInfo?.name || 'Loja não selecionada'}</h4>
                  <p class="list-item-sub">Inspetor: ${i.user || 'Sem nome'} | ${new Date(i.updatedAt).toLocaleString('pt-BR')}</p>
                </div>
                <div class="list-item-actions">
                  <button class="btn btn-sm btn-primary" onclick="window.app.resumeDraft('${i.id}')">Continuar</button>
                  <button class="btn btn-sm btn-secondary" onclick="window.app.duplicateInspection('${i.id}')">Duplicar</button>
                  <button class="btn btn-sm btn-danger" onclick="window.app.deleteInspection('${i.id}')">Excluir</button>
                </div>
              </div>
            `).join('');
          }
        }

        // Concluídos
        const completedContainer = document.getElementById('completed-list');
        if (completedContainer) {
          if (completed.length === 0) {
            completedContainer.innerHTML = '<p class="text-muted text-center p-3">Nenhum relatório concluído registrado.</p>';
          } else {
            completedContainer.innerHTML = completed.map(i => `
              <div class="list-item-card">
                <div class="list-item-main">
                  <h4 class="list-item-title">[${i.storeInfo?.code || 'N/A'}] ${i.storeInfo?.name || 'Loja'}</h4>
                  <p class="list-item-sub">Concluído em: ${new Date(i.updatedAt).toLocaleString('pt-BR')} por ${i.user}</p>
                </div>
                <div class="list-item-actions">
                  <button class="btn btn-sm btn-success" onclick="window.app.reGeneratePDF('${i.id}')">Baixar PDF</button>
                  <button class="btn btn-sm btn-secondary" onclick="window.app.duplicateInspection('${i.id}')">Duplicar</button>
                </div>
              </div>
            `).join('');
          }
        }
      };
    } catch (err) {
      console.error("Erro ao listar inspeções:", err);
    }
  }

  /**
   * Retoma um rascunho salvo
   */
  async resumeDraft(id) {
    const tx = this.db.transaction('inspections', 'readonly');
    const store = tx.objectStore('inspections');
    const req = store.get(id);

    req.onsuccess = () => {
      if (req.result) {
        this.currentInspection = req.result;
        this.currentModuleIndex = 0;
        this.currentQuestionIndex = 0;
        this.renderActiveQuestionCard();
        this.showView('inspection-active');
      }
    };
  }

  /**
   * Duplica uma inspeção existente
   */
  async duplicateInspection(id) {
    const tx = this.db.transaction('inspections', 'readonly');
    const store = tx.objectStore('inspections');
    const req = store.get(id);

    req.onsuccess = async () => {
      if (req.result) {
        const copy = JSON.parse(JSON.stringify(req.result));
        copy.id = 'INSP_' + Date.now();
        copy.dateTime = new Date().toISOString();
        copy.status = 'draft';
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = new Date().toISOString();

        const writeTx = this.db.transaction('inspections', 'readwrite');
        await writeTx.objectStore('inspections').put(copy);

        alert("Inspeção duplicada como novo rascunho!");
        this.renderDashboardLists();
      }
    };
  }

  /**
   * Re-gera o PDF de uma inspeção concluída
   */
  async reGeneratePDF(id) {
    const tx = this.db.transaction('inspections', 'readonly');
    const store = tx.objectStore('inspections');
    const req = store.get(id);

    req.onsuccess = async () => {
      if (req.result) {
        this.showPdfLoadingModal(true);
        setTimeout(async () => {
          try {
            await this.pdfGenerator.generatePDF(req.result, false);
            this.showPdfLoadingModal(false);
          } catch (e) {
            this.showPdfLoadingModal(false);
            alert("Erro ao gerar PDF: " + e.message);
          }
        }, 100);
      }
    };
  }

  /**
   * Exclui uma inspeção
   */
  async deleteInspection(id) {
    if (confirm("Tem certeza que deseja excluir este rascunho? Esta ação não pode ser desfeita.")) {
      const tx = this.db.transaction('inspections', 'readwrite');
      await tx.objectStore('inspections').delete(id);
      this.renderDashboardLists();
    }
  }

  /**
   * Confirma e limpa todos os dados locais
   */
  async confirmClearAllData() {
    if (confirm("ATENÇÃO: Esta ação apagar todos os rascunhos e históricos de relatórios deste celular. Deseja continuar?")) {
      const tx = this.db.transaction('inspections', 'readwrite');
      await tx.objectStore('inspections').clear();
      alert("Todos os dados locais foram removidos com sucesso.");
      this.renderDashboardLists();
    }
  }

  /**
   * Fecha todos os modais da tela
   */
  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
  }
}

// Inicializa o aplicativo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SupermarketChecklistApp();
});
