import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Zap,
  Brain,
  Bot,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  Clock,
  Shield,
  Sparkles,
  BarChart3,
  Cpu,
  Upload,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Story Points AI</span>
            </div>
            <Link href="/tool">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Acessar Ferramenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI & Machine Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Estime Story Points com
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Inteligência Artificial
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Automatize e padronize suas estimativas ágeis com 6 métodos diferentes: Regras, Machine Learning, BERT
              Fine-tuned, Groq, Grok e ajuste manual.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/tool">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3"
              >
                <Target className="mr-2 h-5 w-5" />
                Começar Agora - Grátis
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-slate-300 hover:bg-slate-50 bg-transparent"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-slate-600">Métodos de Estimativa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">85%</div>
              <div className="text-slate-600">Precisão com ML</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-slate-600">Gratuito e Local</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">6 Métodos Poderosos de Estimativa</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Combine diferentes abordagens para obter as estimativas mais precisas e confiáveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Método 1: Regras */}
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-slate-600" />
                  </div>
                  <Badge variant="secondary">Sempre Disponível</Badge>
                </div>
                <CardTitle className="text-lg">Baseado em Regras</CardTitle>
                <CardDescription>
                  Análise instantânea de palavras-chave para complexidade, escopo e dependências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instantâneo e consistente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Explicação detalhada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Personalizável</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método 2: BERT */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">Especializado</Badge>
                </div>
                <CardTitle className="text-lg">BERT Fine-tuned</CardTitle>
                <CardDescription>Modelo especializado treinado especificamente para story points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>100% local e privado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Treinado com dados reais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Score de confiança</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método 3: Machine Learning */}
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-emerald-600" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Aprende</Badge>
                </div>
                <CardTitle className="text-lg">Machine Learning</CardTitle>
                <CardDescription>Rede neural que aprende com seus dados históricos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Melhora com o tempo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Personalizado para você</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Deep Learning</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método 4: IA Groq */}
            <Card className="border-purple-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">IA Generativa</Badge>
                </div>
                <CardTitle className="text-lg">Groq (Llama 3.1)</CardTitle>
                <CardDescription>Análise contextual avançada com IA generativa ultra-rápida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Análise semântica profunda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ultra-rápido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contextual</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método 5: IA Grok */}
            <Card className="border-indigo-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Alternativa</Badge>
                </div>
                <CardTitle className="text-lg">Grok (xAI)</CardTitle>
                <CardDescription>Perspectiva alternativa com o modelo da xAI para comparação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Diversidade de análise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Backup inteligente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Comparação</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método 6: Manual */}
            <Card className="border-amber-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-amber-600" />
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">Controle Total</Badge>
                </div>
                <CardTitle className="text-lg">Ajuste Manual</CardTitle>
                <CardDescription>Controle final com sua experiência e conhecimento específico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Experiência humana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contexto específico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Decisão final</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Por que Escolher Nossa Ferramenta?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Desenvolvida especificamente para equipes ágeis que buscam precisão e eficiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Economia de Tempo</h3>
              <p className="text-slate-600">Reduza o tempo gasto em planning poker em até 70%</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Maior Precisão</h3>
              <p className="text-slate-600">Estimativas mais consistentes e baseadas em dados</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">100% Privado</h3>
              <p className="text-slate-600">Seus dados ficam no seu navegador, total privacidade</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Melhoria Contínua</h3>
              <p className="text-slate-600">O modelo aprende e melhora com cada estimativa</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Processo simples e intuitivo para obter estimativas precisas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Descreva a Tarefa</h3>
              <p className="text-slate-600">
                Adicione título, descrição detalhada e tipo da tarefa (feature, bug, refactor, documentação)
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Obtenha Estimativas</h3>
              <p className="text-slate-600">
                Use múltiplos métodos: regras, BERT, ML, IA generativa. Compare e escolha a melhor
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ajuste e Salve</h3>
              <p className="text-slate-600">
                Faça ajustes manuais se necessário e salve. O sistema aprende com cada tarefa salva
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Recursos Completos para Equipes Ágeis
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Importação de Dados Históricos</h3>
                    <p className="text-slate-600">Importe suas tarefas via CSV para treinar o modelo rapidamente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Análise de Legibilidade</h3>
                    <p className="text-slate-600">Verifique a clareza das descrições com métricas detalhadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Configuração Personalizada</h3>
                    <p className="text-slate-600">Adapte palavras-chave e regras ao seu domínio específico</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Histórico Completo</h3>
                    <p className="text-slate-600">Acompanhe todas as estimativas e compare métodos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Explicações Detalhadas</h3>
                    <p className="text-slate-600">Entenda como cada estimativa foi calculada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Importar CSV</span>
                  <Badge variant="secondary" className="ml-auto">
                    Novo
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Machine Learning</span>
                  <Badge className="ml-auto bg-emerald-100 text-emerald-700">85% precisão</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">BERT Fine-tuned</span>
                  <Badge className="ml-auto bg-orange-100 text-orange-700">Especializado</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">IA Generativa</span>
                  <Badge className="ml-auto bg-purple-100 text-purple-700">Groq + Grok</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-slate-600" />
                  <span className="font-medium">Configurável</span>
                  <Badge variant="outline" className="ml-auto">
                    Personalize
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para Revolucionar suas Estimativas?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se às equipes que já estão economizando tempo e melhorando a precisão das suas estimativas ágeis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tool">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <Target className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              Ver Documentação
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-4">✨ Gratuito • 🔒 Privado • 🚀 Sem instalação</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Story Points AI</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Ferramenta completa para estimativa de story points com inteligência artificial, machine learning e
                análise baseada em regras.
              </p>
              <div className="flex gap-4">
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  <Star className="h-3 w-3 mr-1" />
                  Open Source
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Privacidade Total
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/tool" className="hover:text-white transition-colors">
                    Estimador
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500">Importar CSV</span>
                </li>
                <li>
                  <span className="text-slate-500">Machine Learning</span>
                </li>
                <li>
                  <span className="text-slate-500">BERT Fine-tuned</span>
                </li>
                <li>
                  <span className="text-slate-500">IA Generativa</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-slate-500">Documentação</span>
                </li>
                <li>
                  <span className="text-slate-500">Guias</span>
                </li>
                <li>
                  <span className="text-slate-500">FAQ</span>
                </li>
                <li>
                  <span className="text-slate-500">Comunidade</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Story Points AI. Desenvolvido com ❤️ para equipes ágeis.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
