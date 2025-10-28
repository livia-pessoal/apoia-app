import { Handler, HandlerEvent } from '@netlify/functions';

// Interface para os dados recebidos
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
 * Netlify Function: Análise de cadastro de apoiadora com Gemini AI
 * 
 * Endpoint: /.netlify/functions/ai-approval
 * Method: POST
 * Body: { displayName, email, phone, motivation, causes }
 * 
 * Esta função roda no servidor do Netlify, evitando problemas de CORS/ITP no iOS
 */
export const handler: Handler = async (event: HandlerEvent) => {
  // Apenas POST é permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse do body
    const data: SupporterData = JSON.parse(event.body || '{}');

    // Validação básica
    if (!data.displayName || !data.email || !data.phone || !data.motivation || !data.causes) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          decision: 'REVIEW',
          reason: 'Dados incompletos'
        })
      };
    }

    // Buscar API key do Gemini (configurada no Netlify como variável de ambiente)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY não configurada no Netlify');
      return {
        statusCode: 200,
        body: JSON.stringify({
          decision: 'REVIEW',
          reason: 'IA não configurada - revisão manual necessária'
        })
      };
    }

    // Importar o SDK do Gemini
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // Montar prompt
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

    // Timeout de 8 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Chamar Gemini
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      clearTimeout(timeoutId);

      const responseText = response.text;
      console.log('🤖 Resposta Gemini:', responseText);

      // Parse da resposta
      const decisionMatch = responseText.match(/DECISÃO:\s*(APPROVE|REVIEW|REJECT)/i);
      const reasonMatch = responseText.match(/RAZÃO:\s*(.+)/i);

      if (!decisionMatch) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            decision: 'REVIEW',
            reason: 'Erro ao analisar resposta da IA'
          })
        };
      }

      const result: AnalysisResult = {
        decision: decisionMatch[1].toUpperCase() as 'APPROVE' | 'REVIEW' | 'REJECT',
        reason: reasonMatch?.[1]?.trim() || 'Análise concluída'
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      };

    } catch (aiError: any) {
      clearTimeout(timeoutId);
      
      // Timeout ou erro na IA
      if (aiError.name === 'AbortError' || aiError.message?.includes('abort')) {
        console.warn('⏱️ Timeout na análise IA');
        return {
          statusCode: 200,
          body: JSON.stringify({
            decision: 'REVIEW',
            reason: 'Timeout na análise - revisão manual necessária'
          })
        };
      }

      throw aiError;
    }

  } catch (error: any) {
    console.error('❌ Erro na função ai-approval:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        decision: 'REVIEW',
        reason: 'Erro no servidor - revisão manual necessária',
        error: error.message
      })
    };
  }
};
