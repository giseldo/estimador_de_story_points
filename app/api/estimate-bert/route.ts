export async function POST(req: Request) {
  try {
    const { title, description } = await req.json()

    if (!title || !description) {
      return Response.json({ error: "Título e descrição são obrigatórios" }, { status: 400 })
    }

    // Verificar se a API key está disponível
    if (!process.env.HUGGINGFACE_API_KEY) {
      return Response.json(
        {
          error: "API_KEY_MISSING",
          message: "Chave da API do Hugging Face não configurada.",
          userMessage: "Modelo BERT não está configurado. Use outros métodos de estimativa.",
        },
        { status: 401 },
      )
    }

    // Combinar título e descrição em um contexto único
    const context = `${title}. ${description}`

    console.log("Enviando para BERT:", { context: context.substring(0, 100) + "..." })

    // Usar a Hugging Face Inference API com URL corrigida
    const response = await fetch(
      "https://api-inference.huggingface.co/models/giseldo/distilbert_bert_uncased_finetuned_story_point",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: context,
          options: {
            wait_for_model: true,
          },
        }),
      },
    )

    console.log("Resposta da API:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na API do Hugging Face:", errorText)

      // Verificar se é erro 404 (modelo não encontrado)
      if (response.status === 404) {
        return Response.json(
          {
            error: "MODEL_NOT_FOUND",
            message: "Modelo BERT não encontrado no Hugging Face.",
            userMessage:
              "O modelo BERT não está disponível. Verifique se o modelo existe ou use outros métodos de estimativa.",
          },
          { status: 404 },
        )
      }

      if (response.status === 503) {
        return Response.json(
          {
            error: "MODEL_LOADING",
            message: "Modelo está carregando. Tente novamente em alguns segundos.",
            userMessage: "O modelo BERT está inicializando. Aguarde alguns segundos e tente novamente.",
          },
          { status: 503 },
        )
      }

      if (response.status === 429) {
        return Response.json(
          {
            error: "RATE_LIMIT_EXCEEDED",
            message: "Limite de requisições atingido.",
            userMessage: "Muitas requisições simultâneas. Aguarde alguns segundos e tente novamente.",
          },
          { status: 429 },
        )
      }

      if (response.status === 401 || response.status === 403) {
        return Response.json(
          {
            error: "API_KEY_ERROR",
            message: "Problema com a chave da API do Hugging Face.",
            userMessage: "Erro de autenticação. Verifique a configuração da API ou use outros métodos de estimativa.",
          },
          { status: 401 },
        )
      }

      return Response.json(
        {
          error: "API_ERROR",
          message: "Erro na comunicação com o modelo BERT.",
          userMessage: "Erro temporário no serviço BERT. Tente novamente em alguns instantes.",
        },
        { status: 503 },
      )
    }

    const result = await response.json()
    console.log("Resultado do BERT:", result)

    // O modelo retorna um array de classificações com labels e scores
    if (Array.isArray(result) && result.length > 0) {
      // Encontrar a classificação com maior score
      const bestPrediction = result.reduce((prev, current) => (prev.score > current.score ? prev : current))

      // Extrair o número do label (assumindo que o label é o story point)
      const pointsMatch = bestPrediction.label.match(/\d+/)
      const points = pointsMatch ? Number.parseInt(pointsMatch[0], 10) : null

      // Verificar se o número está na sequência de Fibonacci
      const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

      if (points && fibonacciPoints.includes(points)) {
        return Response.json({
          points,
          confidence: bestPrediction.score,
          allPredictions: result,
        })
      } else {
        // Se não for um número válido da sequência, usar o mais próximo
        const closestPoint = fibonacciPoints.reduce((prev, curr) =>
          Math.abs(curr - (points || 3)) < Math.abs(prev - (points || 3)) ? curr : prev,
        )

        return Response.json({
          points: closestPoint,
          confidence: bestPrediction.score,
          note: "Estimativa ajustada para sequência de Fibonacci",
          allPredictions: result,
        })
      }
    } else {
      console.error("Formato de resposta inesperado:", result)
      return Response.json({
        points: 3,
        confidence: 0.5,
        note: "Estimativa padrão usada devido a resposta não padrão do modelo",
      })
    }
  } catch (error) {
    console.error("Erro ao estimar story points com BERT:", error)
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: "Erro interno do servidor",
        userMessage: "Erro interno. Tente novamente ou use outros métodos de estimativa.",
      },
      { status: 500 },
    )
  }
}
