import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface AIAnalysisStatusProps {
  isLoading: boolean
  model: string | null
  points: number | null
  error: string | null
}

export function AIAnalysisStatus({ isLoading, model, points, error }: AIAnalysisStatusProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
          <p className="text-sm font-medium text-slate-600">Analisando com {model === "groq" ? "Groq" : "Grok"}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-red-50">
        <p className="text-sm font-medium text-red-600">Erro: {error}</p>
      </div>
    )
  }

  if (points !== null) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
        <p className="text-sm font-medium text-slate-600">Estimativa com {model === "groq" ? "Groq" : "Grok"}</p>
        <div className="mt-2 flex items-center justify-center">
          <Badge variant="secondary" className="text-2xl px-4 py-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
            {points} {points === 1 ? "ponto" : "pontos"}
          </Badge>
        </div>
      </div>
    )
  }

  return null
}
