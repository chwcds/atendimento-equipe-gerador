/**
 * PDF GENERATOR - Módulo de Geração de Relatórios em PDF usando jsPDF
 */

class ChecklistPDFGenerator {
  constructor() {
    this.primaryColor = [27, 67, 50];    // #1b4332 - Verde Escuro institucional
    this.secondaryColor = [45, 106, 79];  // #2d6a4f
    this.accentColor = [82, 183, 136];    // #52b788
    this.dangerColor = [217, 4, 41];      // #d90429 - Vermelho Não Conforme
    this.warningColor = [247, 127, 0];    // #f77f00 - Laranja
    this.textColor = [33, 37, 41];       // #212529
    this.lightBg = [248, 249, 250];       // #f8f9fa
  }

  /**
   * Sanitiza strings para composição de nome de arquivo
   */
  sanitizeFilename(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toUpperCase();
  }

  /**
   * Gera e opcionalmente compartilha o relatório em PDF
   */
  async generatePDF(inspectionData, triggerShare = true) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("Biblioteca jsPDF não encontrada. Verifique a conexão local.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let y = margin;

    const checkPageOverflow = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin + 10;
        this.renderHeaderBar(doc, inspectionData, pageWidth);
      }
    };

    // --- CAPA / CABEÇALHO DA PRIMEIRA PÁGINA (Título e Subtítulo Centralizados) ---
    doc.setFillColor(...this.primaryColor);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text("RELATÓRIO DE INSPEÇÃO DE MANUTENÇÃO", pageWidth / 2, 13, { align: 'center' });

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.text("ATENDIMENTO EQUIPE GERADOR", pageWidth / 2, 20, { align: 'center' });

    y = 36;

    // --- SEÇÃO 1: IDENTIFICAÇÃO DA VISITA E DA LOJA ---
    const store = inspectionData.storeInfo || {};
    const dateFormatted = inspectionData.dateTime ? new Date(inspectionData.dateTime).toLocaleString('pt-BR') : 'N/A';
    const fullAddress = `${store.address || ''}, ${store.city || ''} - ${store.state || ''}`;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(`Endereço: ${fullAddress}`, pageWidth - (margin * 2) - 8);

    const boxHeight = 32 + (addressLines.length * 4.5);

    doc.setFillColor(...this.lightBg);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), boxHeight, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...this.primaryColor);
    doc.text("IDENTIFICAÇÃO DA VISITA", margin + 4, y + 7);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...this.textColor);

    // Linha 1: Responsável e Data/Hora
    doc.text(`Responsável: ${inspectionData.user || 'N/A'}`, margin + 4, y + 14);
    doc.text(`Data / Hora: ${dateFormatted}`, pageWidth - margin - 4, y + 14, { align: 'right' });

    // Linha 2: Loja
    doc.setFont("helvetica", "bold");
    doc.text(`Loja: [${store.code || 'N/A'}] ${store.name || 'N/A'}`, margin + 4, y + 20);
    doc.setFont("helvetica", "normal");

    // Linha 3: Endereço
    doc.text(addressLines, margin + 4, y + 26);

    // Linha 4: Geolocalização
    const geoY = y + 26 + (addressLines.length * 4.5);
    const geo = inspectionData.geolocation;
    if (geo && geo.latitude) {
      doc.text(`Geolocalização: Lat: ${geo.latitude.toFixed(6)}, Long: ${geo.longitude.toFixed(6)} (Precisão: ${Math.round(geo.accuracy)}m)`, margin + 4, geoY);
    } else {
      doc.setTextColor(...this.dangerColor);
      doc.text(`Geolocalização: Não capturada (${geo?.error || 'Não disponibilizada'})`, margin + 4, geoY);
      doc.setTextColor(...this.textColor);
    }

    y += boxHeight + 6;

    // --- SEÇÃO 2: RESUMO EXECUTIVO ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...this.primaryColor);
    doc.text("RESUMO EXECUTIVO", margin, y);
    y += 4;

    const stats = inspectionData.stats || { total: 0, conformes: 0, naoConformes: 0, na: 0 };
    const boxWidth = (pageWidth - (margin * 2) - 12) / 4;

    const renderStatBox = (x, label, count, colorArr) => {
      doc.setFillColor(colorArr[0], colorArr[1], colorArr[2]);
      doc.roundedRect(x, y, boxWidth, 16, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(String(count), x + (boxWidth / 2), y + 7, { align: 'center' });
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text(label, x + (boxWidth / 2), y + 13, { align: 'center' });
    };

    renderStatBox(margin, "TOTAL AVALIADO", stats.total, [108, 117, 125]);
    renderStatBox(margin + boxWidth + 4, "CONFORMES", stats.conformes, [40, 167, 69]);
    renderStatBox(margin + (boxWidth * 2) + 8, "NÃO CONFORMES", stats.naoConformes, [220, 53, 69]);
    renderStatBox(margin + (boxWidth * 3) + 12, "NÃO APLICÁVEIS", stats.na, [255, 193, 7]);

    y += 22;

    // --- SEÇÃO 3: RELATÓRIO DETALHADO POR MÓDULO ---
    const modules = inspectionData.selectedModules || [];
    for (const modId of modules) {
      const modInfo = (window.CHECKLIST_MODULES || []).find(m => m.id === modId) || { name: modId };
      const modAnswers = (inspectionData.answers && inspectionData.answers[modId]) || {};

      checkPageOverflow(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...this.primaryColor);
      doc.text(`DETALHAMENTO: ${modInfo.name.toUpperCase()}`, margin, y);
      y += 4;

      doc.setDrawColor(...this.accentColor);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      const questions = (window.CHECKLIST_QUESTIONS || {})[modId] || [];

      for (const q of questions) {
        const ans = modAnswers[q.id];
        const val = ans ? (ans.value || 'Não informado') : 'Não informado';
        const isNC = ans ? ans.isNonConforming : false;

        const photoW = 60;
        const photoH = 45;
        const photoGap = 6;
        const photosList = (ans && ans.photos && ans.photos.length > 0) ? ans.photos : [];

        // 1. CÁLCULO PRÉVIO DA ALTURA TOTAL DO BLOCO (Pergunta + Justificativa + Fotos)
        // Garante que a pergunta e suas fotos fiquem SEMPRE juntas na mesma página!
        let totalItemHeight = 8; // Altura da linha de pergunta e resposta

        let justLines = [];
        if (ans && ans.justification) {
          doc.setFontSize(8.5);
          justLines = doc.splitTextToSize(`Obs/Justificativa: ${ans.justification}`, pageWidth - (margin * 2) - 16);
          totalItemHeight += (justLines.length * 4.5) + 2;
        }

        if (photosList.length > 0) {
          const numPhotoRows = Math.ceil(photosList.length / 2); // 2 fotos por linha
          totalItemHeight += (numPhotoRows * (photoH + 6)) + 2;
        }

        // Se o bloco completo (pergunta + fotos) não couber no restante da página atual, salta para a próxima
        checkPageOverflow(totalItemHeight);

        // 2. RENDERIZAÇÃO DA PERGUNTA E RESPOSTA
        // Indicador de conformidade (círculo verde / vermelho)
        if (isNC) {
          doc.setFillColor(...this.dangerColor);
          doc.circle(margin + 2, y + 2.2, 1.8, 'F');
        } else {
          doc.setFillColor(40, 167, 69);
          doc.circle(margin + 2, y + 2.2, 1.8, 'F');
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...this.textColor);

        const questionText = `${q.label}: `;
        const labelWidth = doc.getTextWidth(questionText);
        const maxTextWidth = pageWidth - (margin * 2) - 8;

        doc.text(questionText, margin + 6, y + 3);

        // Resposta colocada IMEDIATAMENTE após a pergunta para máxima proximidade
        const valText = String(val);
        const valWidth = doc.getTextWidth(valText);

        doc.setFont("helvetica", "bold");
        if (isNC) {
          doc.setTextColor(...this.dangerColor);
        } else {
          doc.setTextColor(...this.primaryColor);
        }

        if (margin + 6 + labelWidth + valWidth < maxTextWidth) {
          doc.text(valText, margin + 6 + labelWidth, y + 3);
          y += 6.5;
        } else {
          y += 5.5;
          doc.text(`Resposta: ${valText}`, margin + 10, y + 2);
          y += 6;
        }

        // 3. RENDERIZAÇÃO DA JUSTIFICATIVA OU OBSERVAÇÃO
        if (justLines.length > 0) {
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(90, 90, 90);
          doc.text(justLines, margin + 8, y + 2);
          y += (justLines.length * 4.5) + 2;
        }

        // 4. RENDERIZAÇÃO DAS FOTOGRAFIAS AMPLIADAS (Na mesma página da pergunta)
        if (photosList.length > 0) {
          let photoX = margin + 6;

          for (const photoBase64 of photosList) {
            try {
              if (photoBase64 && photoBase64.startsWith('data:image')) {
                // Moldura sutil ao redor da foto
                doc.setFillColor(245, 245, 245);
                doc.roundedRect(photoX - 1, y - 1, photoW + 2, photoH + 2, 1, 1, 'F');
                doc.setDrawColor(210, 210, 210);
                doc.roundedRect(photoX - 1, y - 1, photoW + 2, photoH + 2, 1, 1, 'D');

                // Renderiza imagem ampliada
                doc.addImage(photoBase64, 'JPEG', photoX, y, photoW, photoH);

                photoX += photoW + photoGap;

                // Quebra de linha se atingir 2 fotos na mesma linha
                if (photoX + photoW > pageWidth - margin) {
                  photoX = margin + 6;
                  y += photoH + 6;
                }
              }
            } catch (err) {
              console.warn("Foto ignorada ao renderizar PDF devido a formato inválido:", err);
            }
          }

          if (photoX !== margin + 6) {
            y += photoH + 6;
          }
        }

        y += 2;
      }

      y += 4;
    }

    // --- SEÇÃO 4: ENCERRAMENTO E ASSINATURA ---
    checkPageOverflow(40);
    y += 6;

    doc.setFillColor(...this.lightBg);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 35, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...this.primaryColor);
    doc.text("DECLARAÇÃO E ENCERRAMENTO", margin + 4, y + 7);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...this.textColor);
    doc.text("Declaro que o presente relatório registra com exatidão as condições técnicas e operacionais", margin + 4, y + 14);
    doc.text("observadas durante a visita no estabelecimento.", margin + 4, y + 18);

    doc.text(`Emissão: ${new Date().toLocaleString('pt-BR')}`, margin + 4, y + 26);

    const signX = pageWidth - margin - 65;
    doc.line(signX, y + 24, signX + 60, y + 24);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(inspectionData.user || 'Responsável Técnico', signX + 30, y + 28, { align: 'center' });

    // --- NÚMERO DE PÁGINAS E RODAPÉ ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(`Página ${i} de ${totalPages} - Atendimento Equipe Gerador`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    }

    const storeCode = this.sanitizeFilename(store.code || 'LOJA');
    const dateStr = new Date().toISOString().split('T')[0];
    const userStr = this.sanitizeFilename((inspectionData.user || 'RESPONSAVEL').split(' ')[0] + '_' + ((inspectionData.user || '').split(' ')[1] || ''));
    const fileName = `RELATORIO_LOJA_${storeCode}_${dateStr}_${userStr}.pdf`;

    // Compartilhamento via Web Share API se suportado
    if (triggerShare && navigator.share && navigator.canShare) {
      try {
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

        if (navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            files: [pdfFile],
            title: `Relatório de Inspeção - ${store.name || 'Loja'}`,
            text: `Segue o relatório de inspeção da loja ${store.name || ''} por ${inspectionData.user || ''}.`
          });
          return { success: true, shared: true, fileName };
        }
      } catch (err) {
        console.warn("Web Share API cancelada ou não suportada, realizando download direto:", err);
      }
    }

    // Fallback: Download direto do arquivo PDF
    doc.save(fileName);
    return { success: true, shared: false, fileName };
  }

  renderHeaderBar(doc, inspectionData, pageWidth) {
    doc.setFillColor(...this.primaryColor);
    doc.rect(0, 0, pageWidth, 10, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    const storeName = inspectionData.storeInfo ? inspectionData.storeInfo.name : '';
    doc.text(`ATENDIMENTO EQUIPE GERADOR - LOJA: ${storeName.toUpperCase()}`, pageWidth / 2, 6.5, { align: 'center' });
  }
}

if (typeof window !== 'undefined') {
  window.ChecklistPDFGenerator = ChecklistPDFGenerator;
}
