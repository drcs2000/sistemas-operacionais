<template>
  <div class="landing-page">
    <div class="content-wrapper">
      <div class="landing-card">
        <h1>Quiz de Estudos</h1>
        <p>Teste seus conhecimentos e acompanhe sua evolução na matéria!</p>

        <div class="botoes-container">
          <button @click="irParaQuiz" class="btn btn-entrar">
            <span class="icon">▶</span> Entrar (Começar Quiz)
          </button>

          <button @click="irParaRanking" class="btn btn-ranking">
            <span class="icon">🏆</span> Ver Ranking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irParaQuiz = () => {
  console.log('Navegando para a tela de perguntas...')
  // router.push('/quiz')
}

const irParaRanking = () => {
  console.log('Navegando para a tela de ranking...')
  // router.push('/ranking')
}
</script>

<style scoped>
/* Define o fundo e garante que ocupe a tela toda */
.landing-page {
  background-color: #f0f8ff; /* Um azul bem clarinho para o fundo */
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

/* Um container para o card branco */
.landing-card {
  background-color: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* Sombra suave */
  text-align: center;
  width: 90%;
  max-width: 600px;
}

h1 {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
}

p {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.6;
}

.botoes-container {
  display: flex;
  flex-direction: column; /* Botões um em cima do outro */
  gap: 15px;
  align-items: center;
}

.btn {
  padding: 18px 0;
  width: 100%;
  max-width: 350px;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  margin-right: 10px;
  font-size: 1.3rem;
}

.btn:hover {
  transform: translateY(-3px); /* Efeito de flutuar ao passar o mouse */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-entrar {
  background-color: #27ae60; /* Verde vibrante */
  color: white;
}

.btn-entrar:hover {
  background-color: #2ecc71;
}

.btn-ranking {
  background-color: #34495e; /* Azul escuro */
  color: white;
}

.btn-ranking:hover {
  background-color: #2c3e50;
}
</style>
