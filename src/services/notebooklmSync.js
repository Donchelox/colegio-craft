/**
 * ColegioCraft 3D - Servicio de Sincronización con Google NotebookLM
 * Permite importar apuntes, guías de estudio, quizzes y resúmenes generados por NotebookLM
 * mediante archivos/texto Markdown o mediante sincronización remota por URL (GitHub/API/Drive).
 */

// Mapeo inteligente de palabras clave a asignaturas de 2° Básico
const SUBJECT_KEYWORDS = {
  historia: ['historia', 'geografía', 'geografia', 'pueblo', 'originario', 'nómada', 'nomada', 'sedentario', 'aymara', 'mapuche', 'chile', 'zona norte', 'zona sur', 'chonos', 'rapa nui'],
  ciencias: ['ciencia', 'natural', 'corazón', 'corazon', 'hueso', 'esqueleto', 'músculo', 'musculo', 'vertebrado', 'invertebrado', 'agua', 'líquido', 'insecto', 'arácnido', 'hábitat'],
  lenguaje: ['lenguaje', 'comunicación', 'comunicacion', 'cómic', 'comic', 'viñeta', 'globo', 'onomatopeya', 'cuento', 'explícita', 'explicita', 'sustantivo', 'adjetivo', 'familia de palabras', 'fábula'],
  matematicas: ['matemática', 'matematica', 'número', 'numero', 'decena', 'unidad', 'suma', 'resta', 'cálculo', 'calculo', 'geometría', 'geometria', 'cubo', 'esfera', 'arista', 'vértice']
};

export function detectSubject(text = '') {
  const lower = text.toLowerCase();
  let maxScore = 0;
  let bestMatch = 'historia';

  for (const [subj, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    let score = 0;
    keywords.forEach(kw => {
      if (lower.includes(kw)) score += 1;
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = subj;
    }
  }
  return bestMatch;
}

/**
 * Parsea contenido exportado de NotebookLM (Markdown, Texto Plano o JSON)
 * y lo convierte en datos utilizables para Estaciones 3D, Quizzes y Cuadernos.
 */
export function parseNotebookLMContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('El contenido proporcionado está vacío o no es texto.');
  }

  const trimmed = content.trim();

  // 1. Detección de JSON directo
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return normalizeJsonImport(parsed);
    } catch (e) {
      console.warn('No es JSON válido, procesando como Markdown/Texto de NotebookLM...', e);
    }
  }

  // 2. Parser de Markdown / Guía de Estudio de NotebookLM
  const lines = trimmed.split('\n');
  let currentSubject = detectSubject(trimmed);
  let documentTitle = 'Guía NotebookLM';
  
  const extractedStations = [];
  const extractedNotebook = {
    title: '',
    sections: []
  };
  const extractedQuestions = [];

  let currentSection = null;
  let currentStation = null;
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Título Principal (# Título)
    if (line.startsWith('# ')) {
      documentTitle = line.replace('# ', '').trim();
      currentSubject = detectSubject(documentTitle);
      extractedNotebook.title = documentTitle;
      continue;
    }

    // Sección Secundaria (## Título)
    if (line.startsWith('## ')) {
      const secTitle = line.replace('## ', '').trim();
      currentSection = {
        title: secTitle,
        points: []
      };
      extractedNotebook.sections.push(currentSection);
      continue;
    }

    // Subtítulo o Estación (### Estación / Tema / Pregunta)
    if (line.startsWith('### ')) {
      const subTitle = line.replace('### ', '').trim();
      
      // Iniciar nueva estación si parece un tema
      currentStation = {
        id: `nlm_${Date.now()}_${extractedStations.length}`,
        name: subTitle,
        emoji: '📖',
        zone: documentTitle.toUpperCase(),
        badge: 'NOTEBOOK-LM',
        story: '',
        boxTitles: ['💡 Concepto Clave', '🔍 Detalle Importante', '⭐ Resumen'],
        house: '',
        food: '',
        skill: '',
        question: `¿Qué aprendiste sobre ${subTitle}?`,
        options: []
      };
      extractedStations.push(currentStation);
      continue;
    }

    // Detección de Pregunta Tipo Quiz:
    // Ej: "1. ¿Cuál es el órgano...", "P: ¿Por qué...", "**Pregunta: ...**"
    const questionMatch = line.match(/^(\d+[\.\)]|\*\*?[P|Pregunta]:?\*?\*?)\s*(.+)/i);
    if (questionMatch || (line.includes('?') && (line.startsWith('- ') || line.startsWith('* ')))) {
      const qText = questionMatch ? questionMatch[2].replace(/\*+/g, '').trim() : line.replace(/^[-*]\s*/, '').replace(/\*+/g, '').trim();
      
      currentQuestion = {
        id: `q_${Date.now()}_${extractedQuestions.length}`,
        question: qText,
        options: []
      };
      extractedQuestions.push(currentQuestion);

      if (currentStation && (!currentStation.question || currentStation.question.startsWith('¿Qué aprendiste'))) {
        currentStation.question = qText;
      }
      continue;
    }

    // Detección de opciones de respuesta:
    // Ej: "a) Opción", "b) Opción (Correcta)", "- [x] Opción", "- [ ] Opción"
    const optionMatch = line.match(/^([a-d]\)|\- \[[ x]\]|\- \([ x]\))\s*(.+)/i);
    if (optionMatch && currentQuestion) {
      const optRaw = optionMatch[2].trim();
      const isCorrect = optRaw.toLowerCase().includes('(correcta)') || 
                        optRaw.toLowerCase().includes('*correcta*') || 
                        line.toLowerCase().includes('[x]') ||
                        line.toLowerCase().includes('(x)');
      const cleanText = optRaw
        .replace(/\(correcta\)/gi, '')
        .replace(/\*correcta\*/gi, '')
        .replace(/\*+/g, '')
        .trim();

      const optionObj = {
        text: cleanText,
        correct: isCorrect
      };

      currentQuestion.options.push(optionObj);

      if (currentStation && currentStation.question === currentQuestion.question) {
        currentStation.options = currentQuestion.options;
      }
      continue;
    }

    // Si es un punto de viñeta con concepto destacado:
    // Ej: "- **El corazón**: Bombea sangre..."
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const bulletContent = line.replace(/^[-*]\s*/, '').trim();
      if (currentSection) {
        currentSection.points.push(bulletContent);
      }

      // Si tenemos una estación activa, asignar contenido a sus cajas
      if (currentStation) {
        if (!currentStation.story) {
          currentStation.story = bulletContent.replace(/\*+/g, '');
        } else if (!currentStation.house) {
          currentStation.house = bulletContent.replace(/\*+/g, '');
        } else if (!currentStation.food) {
          currentStation.food = bulletContent.replace(/\*+/g, '');
        } else if (!currentStation.skill) {
          currentStation.skill = bulletContent.replace(/\*+/g, '');
        }
      }
      continue;
    }

    // Párrafo normal
    if (currentStation && !currentStation.story) {
      currentStation.story = line.replace(/\*+/g, '');
    } else if (currentSection) {
      currentSection.points.push(line);
    }
  }

  // Asegurar que cada pregunta tenga al menos 1 opción correcta si no fue marcada explícitamente
  extractedQuestions.forEach(q => {
    if (q.options.length > 0 && !q.options.some(o => o.correct)) {
      q.options[0].correct = true; // Primer opción por defecto si no venía marcada
    }
  });

  return {
    subject: currentSubject,
    title: documentTitle,
    stations: extractedStations,
    questions: extractedQuestions,
    notebook: extractedNotebook,
    source: 'notebooklm_text_import',
    syncedAt: new Date().toISOString()
  };
}

function normalizeJsonImport(data) {
  if (Array.isArray(data)) {
    return {
      subject: 'historia',
      stations: data,
      syncedAt: new Date().toISOString()
    };
  }

  return {
    subject: data.subject || detectSubject(data.title || ''),
    title: data.title || 'Contenido Sincronizado',
    stations: Array.isArray(data.stations) ? data.stations : [],
    questions: Array.isArray(data.questions) ? data.questions : [],
    notebook: data.notebook || null,
    source: 'notebooklm_json_import',
    syncedAt: new Date().toISOString()
  };
}

/**
 * Sincroniza desde una URL remota (ej. GitHub Raw, API o Google Apps Script)
 */
export async function syncFromRemoteUrl(url) {
  if (!url || !url.startsWith('http')) {
    throw new Error('Debes proporcionar una URL válida que empiece con http:// o https://');
  }

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json, text/plain, text/markdown, */*'
    },
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`Error al sincronizar desde la URL remota: HTTP ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return parseNotebookLMContent(text);
}
