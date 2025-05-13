import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { description, taskType, model } = await req.json()

    if (!description || !taskType || !model) {
      return Response.json({ error: "Descrição, tipo de tarefa e modelo são obrigatórios" }, { status: 400 })
    }

    const prompt = `
    Você é um especialista em metodologias ágeis e estimativa de story points.
    
    Analise a seguinte descrição de tarefa e estime quantos story points ela deve receber.
    
    Descrição da tarefa: "${description}"
    Tipo da tarefa: "${taskType}"
    
    Considere os seguintes fatores na sua análise:
    1. Complexidade técnica
    2. Esforço necessário
    3. Incertezas e riscos
    4. Dependências
    
    Responda APENAS com um número da sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21) que melhor representa a estimativa de story points para esta tarefa.
    
    Sua resposta deve ser APENAS o número, sem explicações ou texto adicional.
    `

    let result

    if (model === "groq") {
      result = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        temperature: 0.2,
        maxTokens: 10,
      })
    } else if (model === "grok") {
      result = await generateText({
        model: xai("grok-1"),
        prompt,
        temperature: 0.2,
        maxTokens: 10,
      })
    } else {
      return Response.json({ error: "Modelo não suportado" }, { status: 400 })
    }

    // Extrair apenas o número da resposta
    const pointsMatch = result.text.match(/\d+/)
    const points = pointsMatch ? Number.parseInt(pointsMatch[0], 10) : null

    // Verificar se o número está na sequência de Fibonacci
    const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

    if (points && fibonacciPoints.includes(points)) {
      return Response.json({ points })
    } else {
      // Se não for um número válido da sequência, fazer uma estimativa aproximada
      return Response.json({
        points: 3,
        note: "Estimativa padrão usada devido a resposta não padrão do modelo",
      })
    }
  } catch (error) {
    console.error("Erro ao estimar story points:", error)
    return Response.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}
