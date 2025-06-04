// Simplified BERT API that gracefully handles loading issues
export async function POST(req: Request) {
  try {
    const { title, description } = await req.json()

    if (!title || !description) {
      return Response.json({ error: "Título e descrição são obrigatórios" }, { status: 400 })
    }

    // Try to load transformers dynamically
    let transformers
    try {
      transformers = await import("@xenova/transformers")
    } catch (importError) {
      console.error("Failed to import transformers:", importError)
      return Response.json(
        {
          error: "TRANSFORMERS_NOT_AVAILABLE",
          message: "Transformers.js não está disponível",
          userMessage: "O modelo BERT não está disponível no momento. Use outros métodos de estimativa.",
        },
        { status: 503 },
      )
    }

    // Combine title and description into a single context
    const context = `${title} ${description}`

    try {
      // Try to create pipeline with minimal configuration
      const classifier = await transformers.pipeline(
        "text-classification",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english", // Use a simpler, more reliable model
        {
          quantized: false, // Disable quantization to avoid ONNX issues
          device: "cpu", // Force CPU to avoid WebGL issues
        },
      )

      const result = await classifier(context)

      if (!result || !result[0]) {
        throw new Error("Modelo não retornou resultados válidos")
      }

      // Since we're using a sentiment model as fallback, map sentiment to story points
      const sentiment = result[0].label.toLowerCase()
      const confidence = result[0].score

      // Map sentiment to story points (this is a simplified approach)
      let points: number
      if (sentiment.includes("positive")) {
        // Positive sentiment might indicate clearer, simpler tasks
        points = confidence > 0.8 ? 2 : 3
      } else {
        // Negative sentiment might indicate more complex, unclear tasks
        points = confidence > 0.8 ? 8 : 5
      }

      // Adjust based on text length
      const wordCount = context.split(/\s+/).length
      if (wordCount > 100) points = Math.min(21, points + 2)
      if (wordCount < 20) points = Math.max(1, points - 1)

      return Response.json({
        points,
        confidence,
        label: result[0].label,
        note: "Usando modelo de sentimento como aproximação",
      })
    } catch (modelError: any) {
      console.error("Erro ao processar com modelo:", modelError)

      // Provide a rule-based fallback estimation
      const fallbackPoints = estimateFallbackPoints(context)

      return Response.json(
        {
          error: "MODEL_FALLBACK",
          message: "Usando estimativa de fallback",
          userMessage: "Modelo BERT indisponível. Usando estimativa alternativa baseada em análise de texto.",
          points: fallbackPoints,
          confidence: 0.6,
          label: "FALLBACK",
        },
        { status: 200 }, // Return 200 since we have a fallback
      )
    }
  } catch (error) {
    console.error("Erro ao estimar story points com BERT:", error)
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: "Erro interno do servidor",
        userMessage: "Erro interno. Use outros métodos de estimativa.",
      },
      { status: 500 },
    )
  }
}

// Fallback estimation function
function estimateFallbackPoints(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 3 // Base score

  // Complexity indicators
  const complexWords = ["complex", "algorithm", "integration", "architecture", "optimization", "security"]
  const simpleWords = ["simple", "basic", "easy", "quick", "minor", "small"]

  complexWords.forEach((word) => {
    if (lowerText.includes(word)) score += 2
  })

  simpleWords.forEach((word) => {
    if (lowerText.includes(word)) score -= 1
  })

  // Length factor
  const wordCount = text.split(/\s+/).length
  if (wordCount > 100) score += 2
  if (wordCount < 20) score -= 1

  // Map to Fibonacci
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]
  const clampedScore = Math.max(1, Math.min(21, score))

  let closest = fibonacciPoints[0]
  let minDiff = Math.abs(clampedScore - closest)

  for (const fib of fibonacciPoints) {
    const diff = Math.abs(clampedScore - fib)
    if (diff < minDiff) {
      minDiff = diff
      closest = fib
    }
  }

  return closest
}
