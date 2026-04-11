<template>
  <div class="quiz-page">
    <div class="content-wrapper">
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal-card">
          <i class="mdi mdi-alert-circle-outline modal-icon"></i>
          <h3>Reiniciar Quiz?</h3>
          <p>Todo o seu progresso atual será perdido.</p>
          <div class="modal-actions">
            <button @click="mostrarModal = false" class="btn-cancelar">Cancelar</button>
            <button @click="confirmarReiniciar" class="btn-confirmar">Sim, Reiniciar</button>
          </div>
        </div>
      </div>

      <div v-if="quizStore.carregando" class="card centralizado main-quiz-container">
        <i class="mdi mdi-loading mdi-spin loading-icon"></i>
        <h2>Buscando perguntas...</h2>
      </div>

      <div v-else-if="!jogoFinalizado && perguntaAtual" class="card main-quiz-container">
        <div class="quiz-header">
          <div class="header-col header-left">
            <button @click="voltar" class="btn-home-header">
              <i class="mdi mdi-home-variant-outline"></i>
              <span class="desktop-only">Início</span>
            </button>
          </div>

          <div class="header-col header-center">
            <div class="status-group">
              <span class="progresso-texto">{{ indiceAtual + 1 }}/{{ totalPerguntas }}</span>
              <span class="acertos-badge">
                <i class="mdi mdi-check-circle-outline"></i>
                {{ acertos }}/{{ respondidas }}
              </span>
            </div>
          </div>

          <div class="header-col header-right">
            <span class="dificuldade-tag" :class="'dif-' + perguntaAtual.dificuldade">
              {{ dicionarioDificuldade[perguntaAtual.dificuldade] }}
            </span>
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: porcentagemProgresso + '%' }"></div>
        </div>

        <div class="question-wrapper">
          <Transition name="slide-fade" mode="out-in">
            <div :key="indiceAtual" class="question-content">
              <div class="enunciado-container">
                <h2 class="enunciado">{{ enunciadoExibido }}</h2>
                <button
                  v-if="precisaLerMais"
                  @click="textoExpandido = !textoExpandido"
                  class="btn-ler-mais"
                >
                  <i
                    :class="
                      textoExpandido ? 'mdi mdi-minus-box-outline' : 'mdi mdi-plus-box-outline'
                    "
                  ></i>
                  {{ textoExpandido ? ' Mostrar menos' : ' Ler completa' }}
                </button>
              </div>

              <div class="opcoes-container">
                <button
                  v-for="opcao in perguntaAtual.opcoes"
                  :key="opcao.id"
                  @click="checarResposta(opcao.id)"
                  :disabled="respondidoNestaQuestao"
                  class="btn-opcao"
                  :class="getClasseBotao(opcao.id)"
                >
                  {{ opcao.texto }}
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <div class="card-footer">
          <button @click="mostrarModal = true" class="btn-restart-footer">
            <i class="mdi mdi-refresh"></i> Reiniciar progresso
          </button>
        </div>
      </div>

      <div v-else class="card centralizado main-quiz-container">
        <i class="mdi mdi-trophy-outline trophy-icon"></i>
        <h1>Fim do Quiz!</h1>
        <p class="pontuacao-final">
          Você acertou <strong>{{ acertos }}</strong> de <strong>{{ respondidas }}</strong
          >!
        </p>
        <div class="final-actions">
          <button @click="confirmarReiniciar" class="btn btn-voltar-primario">
            <i class="mdi mdi-replay"></i> Tentar Novamente
          </button>
          <button @click="voltar" class="btn btn-voltar-secundario">
            <i class="mdi mdi-home"></i> Ir para o Início
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { quizStore } from '../store/quizStore'
import { rankingStore } from '../store/rankingStore'

const router = useRouter()

const indiceAtual = ref(0)
const acertos = ref(0)
const respondidas = ref(0)
const jogoFinalizado = ref(false)
const respondidoNestaQuestao = ref(false)
const idSelecionado = ref(null)
const mostrarModal = ref(false)
const textoExpandido = ref(false)

const dicionarioDificuldade = {
  1: 'Muito Fácil',
  2: 'Fácil',
  3: 'Médio',
  4: 'Difícil',
  5: 'Muito Difícil',
}

const totalPerguntas = computed(() => quizStore.perguntas.length)
const perguntaAtual = computed(() => quizStore.perguntas[indiceAtual.value])
const porcentagemProgresso = computed(() =>
  totalPerguntas.value === 0 ? 0 : (indiceAtual.value / totalPerguntas.value) * 100,
)

onMounted(async () => {
  await quizStore.buscarPerguntas()
  indiceAtual.value = quizStore.indiceSalvo || 0
  acertos.value = quizStore.acertosSalvos || 0
  respondidas.value = quizStore.respondidasSalvos || 0

  if (indiceAtual.value >= totalPerguntas.value && totalPerguntas.value > 0) {
    jogoFinalizado.value = true
  }
})

const checarResposta = (id) => {
  if (respondidoNestaQuestao.value) return
  idSelecionado.value = id
  respondidoNestaQuestao.value = true
  respondidas.value++

  if (id === perguntaAtual.value.resposta_correta) acertos.value++

  quizStore.salvarProgresso(indiceAtual.value, acertos.value, respondidas.value)

  setTimeout(async () => {
    if (indiceAtual.value < totalPerguntas.value - 1) {
      indiceAtual.value++
      respondidoNestaQuestao.value = false
      idSelecionado.value = null
      textoExpandido.value = false
      quizStore.salvarProgresso(indiceAtual.value, acertos.value, respondidas.value)
    } else {
      jogoFinalizado.value = true
      quizStore.limparProgresso()

      const nomeJogador = localStorage.getItem('quiz_nome_jogador') || 'Anônimo'
      await rankingStore.salvarPontuacao(nomeJogador, acertos.value)
    }
  }, 1200)
}

const getClasseBotao = (idOpcao) => {
  if (!respondidoNestaQuestao.value) return ''
  if (idOpcao === perguntaAtual.value.resposta_correta) return 'correta'
  if (idOpcao === idSelecionado.value) return 'errada'
  return 'desativada'
}

const confirmarReiniciar = () => {
  quizStore.limparProgresso()
  window.location.reload()
}

const LIMITE = 120
const precisaLerMais = computed(() => (perguntaAtual.value?.enunciado?.length || 0) > LIMITE)
const enunciadoExibido = computed(() => {
  if (!perguntaAtual.value?.enunciado) return ''
  return precisaLerMais.value && !textoExpandido.value
    ? perguntaAtual.value.enunciado.substring(0, LIMITE) + '...'
    : perguntaAtual.value.enunciado
})

const voltar = () => router.push('/')
</script>

<style scoped>
/* Garante que o padding não aumente o tamanho final dos elementos */
* {
  box-sizing: border-box;
}

.quiz-page {
  background-color: #f0f8ff;
  min-height: 100dvh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  margin: 0;
  overflow: hidden; /* Trava o scroll da página inteira */
}

.content-wrapper {
  width: 100%;
  max-width: 750px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* Altura fixa (100dvh) removida daqui para não esticar no desktop */
}

.card {
  background-color: white;
  padding: 30px 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 90dvh; /* No desktop, cresce no máximo até 90% da tela */
  /* flex: 1 removido para não forçar o esticamento quando o conteúdo for curto */
}

/* HEADER */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  min-height: 44px;
  gap: 10px;
  flex-shrink: 0;
}

.header-col {
  display: flex;
  align-items: center;
}
.header-left {
  flex: 0 1 auto;
  justify-content: flex-start;
}
.header-center {
  flex: 1 1 auto;
  justify-content: center;
}
.header-right {
  flex: 0 1 auto;
  justify-content: flex-end;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 15px;
}
.progresso-texto {
  font-weight: 700;
  color: #64748b;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-home-header {
  background: #f1f5f9;
  border: none;
  padding: 8px 14px;
  border-radius: 12px;
  color: #475569;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-home-header:hover {
  background: #e2e8f0;
  color: #0284c7;
}

.acertos-badge {
  background-color: #f0f9ff;
  color: #0284c7;
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  border: 1px solid #e0f2fe;
  white-space: nowrap;
}

.dificuldade-tag {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
}
.dif-1 {
  color: #22c55e;
}
.dif-2 {
  color: #eab308;
}
.dif-3 {
  color: #f97316;
}
.dif-4 {
  color: #ef4444;
}
.dif-5 {
  color: #a855f7;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  margin-bottom: 25px;
  overflow: hidden;
  flex-shrink: 0;
}
.progress-bar-fill {
  height: 100%;
  background: #0284c7;
  transition: width 0.4s ease;
}

/* CONTAINER DE QUESTÃO */
.question-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.question-content {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.enunciado-container {
  flex-shrink: 0;
}
.enunciado {
  font-size: 1.4rem;
  color: #1e293b;
  line-height: 1.4;
  font-weight: 800;
  margin-bottom: 12px;
}

/* OPÇÕES COM SCROLL */
.opcoes-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
  padding-bottom: 10px;
  padding-right: 5px;
  overflow-y: auto;
  min-height: 0;
}

.opcoes-container::-webkit-scrollbar {
  width: 6px;
}
.opcoes-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.opcoes-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.btn-opcao {
  padding: 20px 24px;
  font-size: 1.05rem;
  background: #fff;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  color: #475569;
  font-weight: 500;
  flex-shrink: 0;
}
.btn-opcao:hover:not(:disabled) {
  border-color: #0284c7;
  background-color: #f8fafc;
  transform: translateX(4px);
}
.btn-opcao.correta {
  background-color: #f0fdf4 !important;
  border-color: #22c55e !important;
  color: #166534;
  font-weight: 700;
}
.btn-opcao.errada {
  background-color: #fef2f2 !important;
  border-color: #ef4444 !important;
  color: #991b1b;
}

.card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.btn-restart-footer {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
}

/* =============== MOBILE =============== */
@media (max-width: 600px) {
  .content-wrapper {
    padding: 0;
    height: 100dvh; /* No mobile ele precisa ser 100% da tela */
  }

  .card.main-quiz-container {
    border-radius: 0;
    padding: 15px;
    box-shadow: none;
    flex: 1; /* Faz o card preencher o content-wrapper inteiro */
    max-height: 100dvh;
  }

  .opcoes-container {
    padding-bottom: 30px; /* Mais respiro para o scroll no mobile */
  }

  .desktop-only {
    display: none;
  }

  .quiz-header {
    margin-bottom: 15px;
    gap: 5px;
  }
  .btn-home-header {
    padding: 8px;
  }
  .status-group {
    gap: 6px;
  }
  .progresso-texto {
    font-size: 0.85rem;
  }
  .acertos-badge {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  .dificuldade-tag {
    font-size: 0.75rem;
    padding-left: 5px;
  }
  .enunciado {
    font-size: 1.15rem;
  }
  .btn-opcao {
    padding: 16px 20px;
    font-size: 0.95rem;
  }
}

/* Animações e Modais */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-card {
  background: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  max-width: 340px;
}
.modal-icon {
  font-size: 3.5rem;
  color: #ef4444;
  margin-bottom: 10px;
}
.btn-confirmar {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-cancelar {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-ler-mais {
  background: none;
  border: none;
  color: #0284c7;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}
.centralizado {
  text-align: center;
}
.loading-icon {
  font-size: 3rem;
  color: #0d6efd;
  margin-bottom: 15px;
}
</style>
