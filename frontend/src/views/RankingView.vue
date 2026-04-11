<template>
  <div class="ranking-page">
    <div class="content-wrapper">
      <div class="card">
        <div class="action-bar">
          <button @click="voltar" class="btn-voltar">
            <i class="mdi mdi-arrow-left"></i>
            <span>Voltar ao Início</span>
          </button>
        </div>

        <div class="ranking-header">
          <div class="titulo-container">
            <div class="icon-circle-small">
              <i class="mdi mdi-trophy-variant"></i>
            </div>
            <h2>Top 10 Jogadores</h2>
          </div>
        </div>

        <div v-if="rankingStore.carregando" class="estado-container">
          <i class="mdi mdi-loading mdi-spin loading-icon"></i>
          <p>Carregando ranking...</p>
        </div>

        <div v-else-if="rankingStore.erro" class="estado-container erro">
          <i class="mdi mdi-alert-circle-outline erro-icon"></i>
          <p>{{ rankingStore.erro }}</p>
          <button @click="buscarDados" class="btn-tentar-novamente">Tentar Novamente</button>
        </div>

        <div v-else-if="rankingStore.rankings.length === 0" class="estado-container vazio">
          <i class="mdi mdi-clipboard-text-off-outline vazio-icon"></i>
          <p>Nenhuma pontuação registrada ainda.<br />Seja o primeiro a jogar!</p>
        </div>

        <div v-else class="ranking-list">
          <div
            v-for="(jogador, index) in rankingStore.rankings"
            :key="jogador.id"
            class="ranking-item"
            :class="{
              'top-3': index < 3,
              primeiro: index === 0,
              segundo: index === 1,
              terceiro: index === 2,
            }"
          >
            <div class="posicao-col">
              <div class="medalha" v-if="index === 0">
                <i class="mdi mdi-trophy" style="color: #fbbf24"></i>
              </div>
              <div class="medalha" v-else-if="index === 1">
                <i class="mdi mdi-medal" style="color: #94a3b8"></i>
              </div>
              <div class="medalha" v-else-if="index === 2">
                <i class="mdi mdi-medal" style="color: #b45309"></i>
              </div>
              <div class="posicao-numero" v-else>{{ index + 1 }}º</div>
            </div>

            <div class="nome-col">
              <span class="nome">{{ jogador.nome_jogador }}</span>
              <span class="data">{{ formatarData(jogador.data_tentativa) }}</span>
            </div>

            <div class="pontos-col">
              <div class="pontos-badge">{{ jogador.pontuacao }} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { rankingStore } from '../store/rankingStore'

const router = useRouter()

const buscarDados = async () => {
  await rankingStore.buscarRanking()
}

onMounted(() => {
  buscarDados()
})

const formatarData = (dataIso) => {
  if (!dataIso) return ''
  const data = new Date(dataIso)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const voltar = () => {
  router.push('/')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.ranking-page {
  background-color: #f0f8ff;
  min-height: 100dvh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  margin: 0;
  overflow-x: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 650px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card {
  background-color: white;
  padding: 30px 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 90dvh;
}

/* BARRA DE AÇÃO (Topo) */
.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
  width: 100%;
}

.btn-voltar {
  background: transparent;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 12px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-voltar:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

/* HEADER (Título) */
.ranking-header {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.titulo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.titulo-container h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #1e293b;
  font-weight: 800;
}

.icon-circle-small {
  width: 45px;
  height: 45px;
  background-color: #fffbeb;
  color: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* ESTADOS (Loading, Erro, Vazio) */
.estado-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #64748b;
  font-weight: 500;
  text-align: center;
}

.loading-icon {
  font-size: 3rem;
  color: #0d6efd;
  margin-bottom: 15px;
}

.erro-icon,
.vazio-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
}

.erro {
  color: #ef4444;
}
.vazio {
  color: #94a3b8;
}

.btn-tentar-novamente {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* LISTA DE RANKING */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 5px;
  min-height: 0;
}

.ranking-list::-webkit-scrollbar {
  width: 6px;
}
.ranking-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.ranking-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: transform 0.2s;
}

.ranking-item:hover {
  transform: translateX(4px);
  border-color: #cbd5e1;
}

/* Estilos Especiais Top 3 */
.ranking-item.primeiro {
  background-color: #fffbeb;
  border-color: #fde68a;
}
.ranking-item.segundo {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}
.ranking-item.terceiro {
  background-color: #fef3c7;
  border-color: #fcd34d;
}

/* Colunas do Item */
.posicao-col {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.medalha {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.posicao-numero {
  font-weight: 800;
  color: #64748b;
  font-size: 1.2rem;
}

.nome-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 15px;
}

.nome {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.05rem;
}

.data {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
}

.pontos-col {
  display: flex;
  justify-content: flex-end;
}

.pontos-badge {
  background-color: #e0f2fe;
  color: #0284c7;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.95rem;
}

.primeiro .pontos-badge {
  background-color: #fef3c7;
  color: #d97706;
}
.segundo .pontos-badge {
  background-color: #e2e8f0;
  color: #475569;
}
.terceiro .pontos-badge {
  background-color: #ffedd5;
  color: #c2410c;
}

/* =============== MOBILE =============== */
@media (max-width: 600px) {
  .content-wrapper {
    padding: 0;
    height: 100dvh;
  }

  .card {
    border-radius: 0;
    padding: 20px 15px;
    box-shadow: none;
    flex: 1;
    max-height: 100dvh;
  }

  .desktop-only {
    display: none;
  }

  .ranking-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .titulo-container h2 {
    font-size: 1.2rem;
  }
  .icon-circle-small {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .ranking-item {
    padding: 12px 15px;
  }
  .posicao-col {
    width: 40px;
  }
  .medalha {
    font-size: 1.5rem;
  }
  .posicao-numero {
    font-size: 1rem;
  }

  .nome {
    font-size: 0.95rem;
  }
  .pontos-badge {
    padding: 5px 10px;
    font-size: 0.85rem;
  }
}
</style>
