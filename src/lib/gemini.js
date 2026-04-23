/**
 * Enriquece os dados de um lead usando a API do Gemini via fetch direto.
 * @param {Object} candidate - Dados do candidato.
 * @param {string} searchResults - Resultados da pesquisa.
 * @returns {Promise<Object>} - Dados estruturados.
 */
export async function enrichLeadData(candidate, searchResults) {
  const apiKey = "AIzaSyCODvQqqnB3-chhBN1luPEBqa_doK3_Zqo";
  
  // Usando 'gemini-flash-latest' que apareceu na listagem oficial da chave
  const model = "gemini-flash-latest"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    Você é um especialista em inteligência de mercado. Analise os dados do candidato e forneça um resumo profissional e análise de fit.

    DADOS DO CANDIDATO:
    Nome: ${candidate.full_name}
    Email: ${candidate.email}
    Área: ${candidate.area}
    Cidade: ${candidate.city}
    Justificativa: ${candidate.justification || "Não fornecida"}

    INSTRUÇÕES CRÍTICAS:
    1. NÃO invente ou tente adivinhar links de LinkedIn ou Instagram.
    2. Só retorne links se você tiver certeza absoluta de que pertencem a esta pessoa (baseado em área/cidade).
    3. Se não tiver certeza, deixe "linkedin_url" e "instagram_handle" como null.
    4. Crie um "summary" (resumo) profissional útil e avalie o "fit_score" (0-10).

    Retorne APENAS um JSON:
    {
      "linkedin_url": null,
      "instagram_handle": null,
      "summary": "string",
      "interests": ["string"],
      "fit_score": number,
      "fit_reason": "string"
    }
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Gemini:", data);
      // Fallback para gemini-pro-latest se disponível
      if (response.status === 404) {
        return await fallbackPro(candidate, searchResults, apiKey);
      }
      return null;
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erro Enriquecimento:", error);
    return null;
  }
}

async function fallbackPro(candidate, searchResults, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `JSON do candidato ${candidate.full_name}: ${searchResults}` }] }]
      })
    });
    const data = await response.json();
    if (!response.ok) return null;
    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    return null;
  }
}
