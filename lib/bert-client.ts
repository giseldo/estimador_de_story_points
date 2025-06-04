// Client-side BERT implementation as fallback
let transformersModule: any = null
let pipeline: any = null

export async function loadBertModel() {
  try {
    if (!transformersModule) {
      // Dynamic import to avoid SSR issues
      transformersModule = await import("@xenova/transformers")
    }

    if (!pipeline) {
      console.log("Loading BERT model on client...")
      pipeline = await transformersModule.pipeline(
        "text-classification",
        "giseldo/distilbert_bert_uncased_finetuned_story_point",
        {
          quantized: true,
          device: "wasm",
          cache_dir: null,
        },
      )
      console.log("BERT model loaded successfully on client")
    }

    return pipeline
  } catch (error) {
    console.error("Error loading BERT model on client:", error)
    throw error
  }
}

export async function estimateWithBert(title: string, description: string) {
  try {
    const classifier = await loadBertModel()
    const context = `${title} ${description}`

    const result = await classifier(context, { topk: 1 })

    if (!result || !result[0]) {
      throw new Error("Modelo não retornou resultados válidos")
    }

    // Parse the result
    const labelMatch = result[0].label.match(/LABEL_(\d+)/) || result[0].label.match(/(\d+)/)

    if (!labelMatch) {
      throw new Error(`Formato de label inesperado: ${result[0].label}`)
    }

    const labelIndex = Number.parseInt(labelMatch[1], 10)
    const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

    // If it's a direct number, find closest Fibonacci
    let points: number
    if (result[0].label.includes("LABEL_")) {
      points = fibonacciPoints[labelIndex] || 3
    } else {
      // Find closest Fibonacci number
      let closest = fibonacciPoints[0]
      let minDiff = Math.abs(labelIndex - closest)

      for (const fib of fibonacciPoints) {
        const diff = Math.abs(labelIndex - fib)
        if (diff < minDiff) {
          minDiff = diff
          closest = fib
        }
      }
      points = closest
    }

    return {
      points,
      confidence: result[0].score,
      label: result[0].label,
    }
  } catch (error) {
    console.error("Error in client-side BERT estimation:", error)
    throw error
  }
}
