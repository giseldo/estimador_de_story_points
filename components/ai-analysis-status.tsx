"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Clock, Wifi } from "lucide-react"

interface AIAnalysisStatusProps {
  isLoading: boolean
  model: string | null
  points: number | null
  error: string | null
  onRetry?: () => void
}

export function AIAnalysisStatus({ isLoading, model, points, error, onRetry }: AIAnalysisStatusProps) {
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
    // Parse error type from the error message
    let errorType = "GENERIC"
    let userMessage = error
    let icon = AlertTriangle
    let canRetry = true

    if (error.includes("CREDIT_LIMIT_EXCEEDED") || error.includes("créditos") || error.includes("spending limit")) {
      errorType = "CREDIT_LIMIT"
      userMessage = "Limite de créditos da API atingido. Use a estimativa baseada em regras por enquanto."
      icon = AlertTriangle
      canRetry = false
    } else if (error.includes("RATE_LIMIT_EXCEEDED") || error.includes("rate limit")) {
      errorType = "RATE_LIMIT"
      userMessage = "Muitas solicitações. Aguarde alguns segundos e tente novamente."
      icon = Clock
      canRetry = true
    } else if (error.includes("API_ERROR") || error.includes("503")) {
      errorType = "API_ERROR"
      userMessage = "Serviço temporariamente indisponível. Tente novamente em alguns instantes."
      icon = Wifi
      canRetry = true
    }

    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <icon className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          <span>Erro na análise com IA</span>
          {canRetry && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
              Tentar Novamente
            </Button>
          )}
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm">{userMessage}</p>
          {errorType === "CREDIT_LIMIT" && (
            <p className="text-xs mt-2 text-red-600">
              💡 <strong>Dica:</strong> A estimativa baseada em regras continua funcionando normalmente e oferece boa
              precisão.
            </p>
          )}
          {errorType === "RATE_LIMIT" && (
            <p className="text-xs mt-2 text-red-600">
              💡 <strong>Dica:</strong> Aguarde 10-30 segundos antes de tentar novamente.
            </p>
          )}
        </AlertDescription>
      </Alert>
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
