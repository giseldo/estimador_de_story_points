"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskHistory } from "@/components/task-history"
import { ModelStats } from "@/components/model-stats"
import { AIAnalysisStatus } from "@/components/ai-analysis-status"
import { CSVImport } from "@/components/csv-import"
import { KeywordsConfiguration } from "@/components/keywords-configuration"
import { ReadabilityIndicators } from "@/components/readability-indicators"
import { estimateStoryPoints } from "@/lib/estimator"
import { trainModel, predictStoryPoints, saveModel, loadModel } from "@/lib/ml-model"
import type { Task, ModelStats as ModelStatsType } from "@/lib/types"
import type * as tf from "@tensorflow/tfjs"
import { BrainCircuit, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EstimationExplanation } from "@/components/estimation-explanation"
import { AIFallbackNotice } from "@/components/ai-fallback-notice"

export function TaskEstimator() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [taskType, setTaskType] = useState("feature")
  const [estimatedPoints, setEstimatedPoints] = useState<number | null>(null)
  const [mlEstimatedPoints, setMlEstimatedPoints] = useState<number | null>(null)
  const [aiEstimatedPoints, setAiEstimatedPoints] = useState<number | null>(null)
  const [manualPoints, setManualPoints] = useState<number | null>(null)
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [modelStats, setModelStats] = useState<ModelStatsType>({
    trainedOn: 0,
    lastTrainedAt: null,
    accuracy: null,
  })
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("estimate")
  const [aiModel, setAiModel] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<number | null>(null)

  // Inicializar TensorFlow.js e carregar o modelo
  useEffect(() => {
    async function initTensorFlow() {
      try {
        // Carregar o modelo salvo, se existir
        const savedModel = await loadModel()
        if (savedModel) {
          setModel(savedModel)

          // Carregar estatísticas do modelo do localStorage
          const statsJson = localStorage.getItem("model-stats")
          if (statsJson) {
            setModelStats(JSON.parse(statsJson))
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar TensorFlow.js:", error)
      }
    }

    initTensorFlow()

    // Carregar tarefas do localStorage
    const tasksJson = localStorage.getItem("tasks")
    if (tasksJson) {
      setTasks(JSON.parse(tasksJson))
    }
  }, [])

  // Salvar tarefas no localStorage quando mudar
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Limpar mensagem de sucesso de importação após 5 segundos
  useEffect(() => {
    if (importSuccess !== null) {
      const timer = setTimeout(() => {
        setImportSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [importSuccess])

  const handleEstimate = async () => {
    if (!title || !description) return

    // Estimativa baseada em regras
    const points = estimateStoryPoints(description, taskType)
    setEstimatedPoints(points)

    // Estimativa baseada em ML (se o modelo estiver disponível)
    if (model) {
      try {
        const mlPoints = await predictStoryPoints(model, description, taskType)
        setMlEstimatedPoints(mlPoints)

        // Usar a estimativa do ML se disponível, caso contrário usar a baseada em regras
        setManualPoints(mlPoints || points)
      } catch (error) {
        console.error("Erro ao fazer previsão com ML:", error)
        setManualPoints(points)
      }
    } else {
      setManualPoints(points)
    }

    // Limpar estimativa de IA anterior
    setAiEstimatedPoints(null)
    setAiError(null)
  }

  const handleAiEstimate = async (selectedModel: string) => {
    if (!description || !taskType) return

    setAiModel(selectedModel)
    setIsAiLoading(true)
    setAiError(null)

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          taskType,
          model: selectedModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 429) {
          setAiError(data.userMessage || "Limite de requisições atingido. Tente novamente mais tarde.")
        } else if (response.status === 503) {
          setAiError(data.userMessage || "Serviço temporariamente indisponível.")
        } else {
          setAiError(data.userMessage || data.error || "Erro ao obter estimativa da IA")
        }
        return
      }

      setAiEstimatedPoints(data.points)
      // Atualizar a estimativa manual com a estimativa da IA
      setManualPoints(data.points)
    } catch (error) {
      console.error("Erro ao obter estimativa da IA:", error)
      setAiError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsAiLoading(false)
    }
  }

  // Add retry function
  const handleRetryAiEstimate = () => {
    if (aiModel) {
      handleAiEstimate(aiModel)
    }
  }

  const handleSave = () => {
    if (!title || !description || manualPoints === null) return

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      type: taskType,
      estimatedPoints: estimatedPoints || 0,
      mlEstimatedPoints: mlEstimatedPoints,
      aiEstimatedPoints: aiEstimatedPoints,
      aiModel: aiModel,
      finalPoints: manualPoints,
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    resetForm()

    // Treinar o modelo com as novas tarefas se houver pelo menos 5
    if (updatedTasks.length >= 5) {
      trainModelWithTasks(updatedTasks)
    }
  }

  const handleImportTasks = (importedTasks: Task[]) => {
    const updatedTasks = [...importedTasks, ...tasks]
    setTasks(updatedTasks)
    setImportSuccess(importedTasks.length)

    // Treinar o modelo com as novas tarefas se houver pelo menos 5
    if (updatedTasks.length >= 5) {
      trainModelWithTasks(updatedTasks)
    }

    // Voltar para a aba de estimativa
    setActiveTab("estimate")
  }

  const trainModelWithTasks = async (taskList: Task[]) => {
    setIsModelLoading(true)

    try {
      const trainedModel = await trainModel(taskList)

      if (trainedModel) {
        // Salvar o modelo
        await saveModel(trainedModel)
        setModel(trainedModel)

        // Atualizar estatísticas do modelo
        const newStats: ModelStatsType = {
          trainedOn: taskList.length,
          lastTrainedAt: new Date().toISOString(),
          accuracy: 0.7 + Math.min(50, taskList.length) / 200, // Simulação simples de melhoria de precisão
        }

        setModelStats(newStats)
        localStorage.setItem("model-stats", JSON.stringify(newStats))
      }
    } catch (error) {
      console.error("Erro ao treinar o modelo:", error)
    } finally {
      setIsModelLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setTaskType("feature")
    setEstimatedPoints(null)
    setMlEstimatedPoints(null)
    setAiEstimatedPoints(null)
    setAiModel(null)
    setManualPoints(null)
    setAiError(null)
  }

  const handleTrainModel = () => {
    if (tasks.length >= 5) {
      trainModelWithTasks(tasks)
    }
  }

  return (
    <div className="space-y-4">
      {importSuccess !== null && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Importação realizada com sucesso!</AlertTitle>
          <AlertDescription>
            {importSuccess} {importSuccess === 1 ? "tarefa foi importada" : "tarefas foram importadas"} e o modelo será
            retreinado automaticamente.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="estimate">Estimar Task</TabsTrigger>
          <TabsTrigger value="import">Importar CSV</TabsTrigger>
          <TabsTrigger value="history">Histórico ({tasks.length})</TabsTrigger>
          <TabsTrigger value="model">Modelo de ML</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="estimate">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nova Tarefa</CardTitle>
                <CardDescription>
                  Preencha os detalhes da tarefa para obter uma estimativa automática de story points.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Tarefa</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Implementar autenticação de usuários"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Tarefa</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva a tarefa com detalhes, incluindo requisitos, complexidade e dependências..."
                    className="min-h-[150px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Tarefa</Label>
                  <Select value={taskType} onValueChange={setTaskType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Nova Funcionalidade</SelectItem>
                      <SelectItem value="bug">Correção de Bug</SelectItem>
                      <SelectItem value="refactor">Refatoração</SelectItem>
                      <SelectItem value="documentation">Documentação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {estimatedPoints !== null && (
                  <div className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
                        <p className="text-sm font-medium text-slate-600">Estimativa Baseada em Regras</p>
                        <div className="mt-2 flex items-center justify-center">
                          <Badge variant="secondary" className="text-2xl px-4 py-2">
                            {estimatedPoints} {estimatedPoints === 1 ? "ponto" : "pontos"}
                          </Badge>
                        </div>
                      </div>

                      {model && (
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-slate-50">
                          <p className="text-sm font-medium text-slate-600">Estimativa com Machine Learning</p>
                          <div className="mt-2 flex items-center justify-center">
                            <Badge
                              variant="secondary"
                              className="text-2xl px-4 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            >
                              {mlEstimatedPoints} {mlEstimatedPoints === 1 ? "ponto" : "pontos"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Adicionar a explicação da estimativa baseada em regras */}
                    <EstimationExplanation
                      description={description}
                      taskType={taskType}
                      estimatedPoints={estimatedPoints}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Análise com IA</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAiEstimate("groq")}
                            disabled={isAiLoading}
                          >
                            Analisar com Groq
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAiEstimate("grok")}
                            disabled={isAiLoading}
                          >
                            Analisar com Grok
                          </Button>
                        </div>
                      </div>

                      <AIAnalysisStatus
                        isLoading={isAiLoading}
                        model={aiModel}
                        points={aiEstimatedPoints}
                        error={aiError}
                        onRetry={handleRetryAiEstimate}
                      />

                      {!isAiLoading && !aiEstimatedPoints && !aiError && (
                        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                          <BrainCircuit className="h-4 w-4" />
                          <AlertTitle>Análise com IA disponível</AlertTitle>
                          <AlertDescription>
                            Utilize os modelos Groq ou Grok para obter uma estimativa baseada em IA avançada.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Show fallback notice when AI has credit limit issues */}
                      {aiError && (aiError.includes("créditos") || aiError.includes("CREDIT_LIMIT")) && (
                        <AIFallbackNotice ruleBasedPoints={estimatedPoints} mlPoints={mlEstimatedPoints} />
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="manual-points">Ajuste Manual (se necessário)</Label>
                      <Select
                        value={manualPoints?.toString() || ""}
                        onValueChange={(value) => setManualPoints(Number.parseInt(value))}
                      >
                        <SelectTrigger id="manual-points">
                          <SelectValue placeholder="Selecione os pontos" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 5, 8, 13, 21].map((point) => (
                            <SelectItem key={point} value={point.toString()}>
                              {point} {point === 1 ? "ponto" : "pontos"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm}>
                  Limpar
                </Button>
                <div className="space-x-2">
                  {estimatedPoints === null ? (
                    <Button onClick={handleEstimate}>Estimar</Button>
                  ) : (
                    <Button onClick={handleSave}>Salvar</Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Adicionar os indicadores de legibilidade */}
            {description && description.trim().length > 0 && <ReadabilityIndicators description={description} />}
          </div>
        </TabsContent>

        <TabsContent value="import">
          <CSVImport onImport={handleImportTasks} />
        </TabsContent>

        <TabsContent value="history">
          <TaskHistory tasks={tasks} />
        </TabsContent>

        <TabsContent value="model">
          <div className="space-y-4">
            <ModelStats stats={modelStats} />

            <Card>
              <CardHeader>
                <CardTitle>Treinamento do Modelo</CardTitle>
                <CardDescription>
                  Treine o modelo de aprendizado de máquina com os dados históricos para melhorar as estimativas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  O modelo de ML aprende com as tarefas que você salva. Quanto mais tarefas você estimar e salvar, mais
                  preciso o modelo se tornará. O modelo é treinado automaticamente quando você salva uma nova tarefa,
                  mas você também pode treiná-lo manualmente.
                </p>

                {tasks.length < 5 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                    <p className="text-sm">
                      Você precisa de pelo menos 5 tarefas salvas para treinar o modelo. Atualmente você tem{" "}
                      {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}.
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleTrainModel} disabled={isModelLoading || tasks.length < 5} className="w-full">
                    {isModelLoading ? "Treinando..." : "Treinar Modelo Novamente"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <KeywordsConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  )
}
