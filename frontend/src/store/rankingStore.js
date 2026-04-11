import { reactive } from 'vue'
import api from '../services/api'

export const rankingStore = reactive({
  rankings: [],
  carregando: false,
  erro: null,

  async buscarRanking() {
    this.carregando = true
    this.erro = null
    try {
      const resposta = await api.get('/ranking')
      this.rankings = resposta.data
    } catch (erro) {
      console.error('Erro ao buscar ranking:', erro)
      this.erro = 'Não foi possível carregar o ranking.'
    } finally {
      this.carregando = false
    }
  },

  async salvarPontuacao(nomeJogador, pontuacao) {
    this.carregando = true
    this.erro = null
    try {
      await api.post('/ranking', {
        nome_jogador: nomeJogador,
        pontuacao: pontuacao
      })
    } catch (erro) {
      console.error('Erro ao salvar pontuação:', erro)
      this.erro = 'Não foi possível salvar sua pontuação.'
    } finally {
      this.carregando = false
    }
  }
})