// Alternative BERT-like estimation without external dependencies
export interface BertAlternativeResult {
  points: number
  confidence: number
  label: string
  method: string
}

export async function estimateWithBertAlternative(title: string, description: string): Promise<BertAlternativeResult> {
  const context = `${title} ${description}`.toLowerCase()

  // Advanced text analysis without ML dependencies
  const analysis = analyzeTextComplexity(context)
  const points = mapAnalysisToPoints(analysis)

  return {
    points,
    confidence: analysis.confidence,
    label: `COMPLEXITY_${analysis.level}`,
    method: "text-analysis",
  }
}

interface TextAnalysis {
  complexity: number
  clarity: number
  scope: number
  uncertainty: number
  confidence: number
  level: string
}

function analyzeTextComplexity(text: string): TextAnalysis {
  const words = text.split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  // Complexity indicators
  const complexityKeywords = {
    high: ["complex", "complicated", "difficult", "challenging", "intricate", "sophisticated", "advanced"],
    medium: ["moderate", "standard", "typical", "normal", "regular", "common"],
    low: ["simple", "easy", "basic", "straightforward", "minimal", "quick"],
  }

  const technicalKeywords = [
    "algorithm",
    "architecture",
    "integration",
    "optimization",
    "security",
    "performance",
    "scalability",
    "database",
    "api",
    "framework",
  ]

  const uncertaintyKeywords = ["maybe", "possibly", "might", "could", "unclear", "unknown", "tbd", "investigate"]

  const scopeKeywords = {
    large: ["system", "platform", "application", "entire", "complete", "full", "comprehensive"],
    medium: ["module", "component", "feature", "section", "part"],
    small: ["button", "field", "label", "icon", "text", "color"],
  }

  // Calculate metrics
  let complexityScore = 0
  let scopeScore = 0
  let uncertaintyScore = 0

  // Analyze complexity
  complexityKeywords.high.forEach((keyword) => {
    if (text.includes(keyword)) complexityScore += 3
  })
  complexityKeywords.medium.forEach((keyword) => {
    if (text.includes(keyword)) complexityScore += 1
  })
  complexityKeywords.low.forEach((keyword) => {
    if (text.includes(keyword)) complexityScore -= 2
  })

  // Technical complexity
  technicalKeywords.forEach((keyword) => {
    if (text.includes(keyword)) complexityScore += 2
  })

  // Scope analysis
  scopeKeywords.large.forEach((keyword) => {
    if (text.includes(keyword)) scopeScore += 3
  })
  scopeKeywords.medium.forEach((keyword) => {
    if (text.includes(keyword)) scopeScore += 1
  })
  scopeKeywords.small.forEach((keyword) => {
    if (text.includes(keyword)) scopeScore -= 1
  })

  // Uncertainty analysis
  uncertaintyKeywords.forEach((keyword) => {
    if (text.includes(keyword)) uncertaintyScore += 2
  })

  // Text structure analysis
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
  const longSentencePenalty = avgWordsPerSentence > 20 ? 2 : 0

  // Calculate readability (simplified Flesch formula)
  const avgSyllablesPerWord = estimateAverageSyllables(words)
  const readabilityScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord

  // Clarity score (higher readability = higher clarity)
  const clarityScore = Math.max(0, Math.min(100, readabilityScore)) / 100

  // Normalize scores
  const normalizedComplexity = Math.max(0, Math.min(10, complexityScore)) / 10
  const normalizedScope = Math.max(0, Math.min(10, scopeScore)) / 10
  const normalizedUncertainty = Math.max(0, Math.min(10, uncertaintyScore)) / 10

  // Overall complexity
  const overallComplexity =
    normalizedComplexity * 0.4 + normalizedScope * 0.3 + normalizedUncertainty * 0.2 + longSentencePenalty * 0.1

  // Confidence based on text length and clarity
  const lengthFactor = Math.min(1, words.length / 50) // More confident with longer descriptions
  const confidence = Math.max(0.3, Math.min(0.9, clarityScore * 0.6 + lengthFactor * 0.4))

  // Determine complexity level
  let level: string
  if (overallComplexity > 0.7) level = "HIGH"
  else if (overallComplexity > 0.4) level = "MEDIUM"
  else level = "LOW"

  return {
    complexity: overallComplexity,
    clarity: clarityScore,
    scope: normalizedScope,
    uncertainty: normalizedUncertainty,
    confidence,
    level,
  }
}

function estimateAverageSyllables(words: string[]): number {
  const totalSyllables = words.reduce((sum, word) => {
    return sum + estimateSyllables(word)
  }, 0)
  return totalSyllables / Math.max(words.length, 1)
}

function estimateSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "")
  if (word.length <= 3) return 1

  const vowels = word.match(/[aeiouy]/g)
  let syllableCount = vowels ? vowels.length : 1

  // Adjust for common patterns
  if (word.endsWith("e")) syllableCount -= 1
  if (word.includes("le") && word.length > 2) syllableCount += 1

  return Math.max(1, syllableCount)
}

function mapAnalysisToPoints(analysis: TextAnalysis): number {
  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21]

  // Base mapping
  let basePoints: number
  if (analysis.complexity > 0.7) basePoints = 8
  else if (analysis.complexity > 0.5) basePoints = 5
  else if (analysis.complexity > 0.3) basePoints = 3
  else basePoints = 2

  // Adjust for scope
  if (analysis.scope > 0.7) basePoints += 3
  else if (analysis.scope > 0.4) basePoints += 1

  // Adjust for uncertainty
  if (analysis.uncertainty > 0.5) basePoints += 2

  // Adjust for clarity (low clarity = higher points)
  if (analysis.clarity < 0.3) basePoints += 2
  else if (analysis.clarity < 0.5) basePoints += 1

  // Find closest Fibonacci number
  const clampedPoints = Math.max(1, Math.min(21, basePoints))
  let closest = fibonacciPoints[0]
  let minDiff = Math.abs(clampedPoints - closest)

  for (const fib of fibonacciPoints) {
    const diff = Math.abs(clampedPoints - fib)
    if (diff < minDiff) {
      minDiff = diff
      closest = fib
    }
  }

  return closest
}
