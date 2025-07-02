import { TaskEstimator } from "@/components/task-estimator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target } from "lucide-react"
import Link from "next/link"

export default function ToolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/landing">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Story Points AI</span>
              </div>
            </div>
            <Link href="/landing">
              <Button variant="outline" size="sm">
                Sobre a Ferramenta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Estimador de Story Points</h1>
            <p className="mt-3 text-lg text-slate-600">Estime automaticamente a complexidade das suas tarefas</p>
          </div>

          <TaskEstimator />
        </div>
      </main>
    </div>
  )
}
