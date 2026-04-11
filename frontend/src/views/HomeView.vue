<template>
  <div class="landing-page">
    <div class="content-wrapper">
      <div class="landing-card">
        <div class="logo-section">
          <div class="icon-circle">
            <i class="mdi mdi-book-open-variant"></i>
          </div>
          <h1>Quiz de Estudos</h1>
          <p>
            Teste seus conhecimentos e acompanhe sua evolução na matéria de Sistemas Operacionais.
          </p>
        </div>

        <div class="input-group">
          <label for="nomeJogador">Seu Nome/Nickname:</label>
          <input
            id="nomeJogador"
            type="text"
            v-model="nome"
            placeholder="Digite aqui para aparecer no ranking..."
            @keyup.enter="irParaQuiz"
            :class="{ 'input-erro': erroNome }"
          />
          <span v-if="erroNome" class="mensagem-erro">
            <i class="mdi mdi-alert-circle-outline"></i> Por favor, insira um nome para jogar!
          </span>
        </div>

        <div class="botoes-container">
          <button @click="irParaQuiz" class="btn btn-entrar">
            <i class="mdi mdi-play-circle-outline icon"></i>
            Entrar (Começar Quiz)
          </button>

          <button @click="irParaRanking" class="btn btn-ranking">
            <i class="mdi mdi-trophy-outline icon"></i>
            Ver Ranking
          </button>
        </div>

        <div v-if="temProgresso" class="progresso-aviso">
          <i class="mdi mdi-history"></i>
          Você possui um progresso salvo.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const temProgresso = ref(false)

const nome = ref('')
const erroNome = ref(false)

onMounted(() => {
  const salvo = localStorage.getItem('quiz_progresso')
  if (salvo) {
    temProgresso.value = true
  }

  const nomeSalvo = localStorage.getItem('quiz_nome_jogador')
  if (nomeSalvo) {
    nome.value = nomeSalvo
  }
})

const irParaQuiz = () => {
  if (!nome.value.trim()) {
    erroNome.value = true
    return
  }

  erroNome.value = false
  localStorage.setItem('quiz_nome_jogador', nome.value.trim())
  router.push('/quiz')
}

const irParaRanking = () => {
  router.push('/ranking')
}
</script>

<style scoped>
/* Mantive o seu CSS original e adicionei apenas as classes do input */
:global(html, body) {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
}

.landing-page {
  background-color: #f0f8ff;
  height: 100dvh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.landing-card {
  background-color: white;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
}

.logo-section {
  margin-bottom: 30px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background-color: #e7f1ff;
  color: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 20px;
}

h1 {
  font-size: 2rem;
  color: #212529;
  margin-bottom: 15px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

p {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
}

/* === NOVOS ESTILOS DO INPUT === */
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 25px;
  gap: 8px;
}

.input-group label {
  font-weight: 700;
  color: #475569;
  font-size: 0.95rem;
}

.input-group input {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  color: #1e293b;
}

.input-group input:focus {
  outline: none;
  border-color: #0d6efd;
  background-color: #f8fafc;
}

.input-group input.input-erro {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.mensagem-erro {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
/* ============================== */

.botoes-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 16px;
  width: 100%;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn .icon {
  font-size: 1.4rem;
}

.btn-entrar {
  background-color: #0d6efd;
  color: white;
}

.btn-entrar:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.btn-ranking {
  background-color: #f8f9fa;
  color: #212529;
  border: 1.5px solid #dee2e6;
}

.btn-ranking:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.progresso-aviso {
  margin-top: 25px;
  font-size: 0.85rem;
  color: #198754;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .landing-page {
    padding: 0;
    background-color: white;
  }

  .landing-card {
    border-radius: 0;
    box-shadow: none;
    padding: 40px 25px;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .logo-section {
    margin-bottom: 25px;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
