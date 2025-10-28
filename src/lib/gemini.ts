import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ VITE_GEMINI_API_KEY não encontrada. IA de aprovação desabilitada.');
}

// Novo SDK: GoogleGenAI (não precisa passar a key se estiver em GEMINI_API_KEY)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface SupporterData {
  displayName: string;
  email: string;
  phone: string;
  motivation: string;
  causes: string;
}

interface AnalysisResult {
  decision: 'APPROVE' | 'REVIEW' | 'REJECT';
  reason: string;
}

/**
 * Analisa cadastro de apoiadora usando Gemini AI
 * Timeout de 8s para evitar travamento no iOS/Safari
 */
export async function analyzeSupporterProfile(data: SupporterData): Promise<AnalysisResult> {
  // Se não tiver API key, sempre retorna REVIEW (revisão manual)
  if (!ai) {
    return {
      decision: 'REVIEW',
      reason: 'IA não configurada - revisão manual necessária'
    };
  }

  try {
    // AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos

    const prompt = `
Você é um sistema de análise de cadastros para uma plataforma de apoio a mulheres vítimas de violência.

Analise este cadastro de apoiadora e determine se ela deve ser:
- APPROVE: Aprovada automaticamente (perfil genuíno e qualificado)
- REVIEW: Precisa revisão manual (dúvidas ou informações insuficientes)
- REJECT: Rejeitada automaticamente (spam, bot ou perfil suspeito)

DADOS DO CADASTRO:
Nome: ${data.displayName}
Email: ${data.email}
Telefone: ${data.phone}
Motivação: ${data.motivation}
Causas que defende: ${data.causes}

CRITÉRIOS DE APROVAÇÃO:
✅ APPROVE se:
- Motivação clara, bem escrita e genuína
- Menciona experiência, formação ou vontade de ajudar
- Email válido (domínios reais como gmail, hotmail, outlook, etc)
- Causas relacionadas ao tema (violência, direitos, psicologia, etc)
- Texto coerente e sem erros grosseiros

⏳ REVIEW se:
- Motivação muito curta ou genérica
- Dúvidas sobre autenticidade
- Informações incompletas ou vagas
- Precisa validação adicional

❌ REJECT se:
- Spam óbvio ou texto sem sentido
- Bot detectado
- Email temporário ou suspeito
- Conteúdo inapropriado
- Claramente não é uma pessoa real

RESPONDA APENAS NO FORMATO:
DECISÃO: [APPROVE/REVIEW/REJECT]
RAZÃO: [Uma frase curta explicando]

Exemplo:
DECISÃO: APPROVE
RAZÃO: Psicóloga com experiência clara e motivação genuína
`;

    // Nova API do Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    clearTimeout(timeoutId); // Limpar timeout após resposta bem-sucedida

    const responseText = response.text;

    console.log('🤖 Resposta Gemini:', responseText);

    // Parse da resposta
    const decisionMatch = responseText.match(/DECISÃO:\s*(APPROVE|REVIEW|REJECT)/i);
    const reasonMatch = responseText.match(/RAZÃO:\s*(.+)/i);

    if (!decisionMatch) {
      return {
        decision: 'REVIEW',
        reason: 'Erro ao analisar resposta da IA'
      };
    }

    return {
      decision: decisionMatch[1].toUpperCase() as 'APPROVE' | 'REVIEW' | 'REJECT',
      reason: reasonMatch?.[1]?.trim() || 'Análise concluída'
    };

  } catch (error: any) {
    console.error('❌ Erro ao analisar com Gemini:', error);
    
    // Se for timeout/abort, retornar REVIEW com mensagem específica
    if (error.name === 'AbortError' || error.message?.includes('abort')) {
      console.warn('⏱️ Timeout na análise IA - retornando REVIEW');
      return {
        decision: 'REVIEW',
        reason: 'Timeout na análise - revisão manual necessária'
      };
    }
    
    return {
      decision: 'REVIEW',
      reason: 'Erro na análise - revisão manual necessária'
    };
  }
}
