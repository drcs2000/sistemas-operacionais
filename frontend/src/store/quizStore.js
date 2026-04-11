import { reactive } from 'vue'
import api from '../services/api'

export const quizStore = reactive({
  perguntas: [],
  carregando: true,
  
  // Metadados recuperados
  indiceSalvo: 0,
  acertosSalvos: 0,
  respondidasSalvos: 0,

  embaralhar(array) {
    const novoArray = [...array]
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
    }
    return novoArray
  },

  salvarProgresso(indice, acertos, respondidas) {
    const dadosParaSalvar = {
      perguntas: this.perguntas,
      indice,
      acertos,
      respondidas
    }
    localStorage.setItem('quiz_progresso', JSON.stringify(dadosParaSalvar))
  },

  limparProgresso() {
    localStorage.removeItem('quiz_progresso')
    this.perguntas = []
    this.indiceSalvo = 0
    this.acertosSalvos = 0
    this.respondidasSalvos = 0
  },

  async buscarPerguntas() {
    this.carregando = true
    const salvo = localStorage.getItem('quiz_progresso')
    
    if (salvo) {
      const { perguntas, indice, acertos, respondidas } = JSON.parse(salvo)
      this.perguntas = perguntas
      this.indiceSalvo = indice
      this.acertosSalvos = acertos
      this.respondidasSalvos = respondidas
      this.carregando = false
      return
    }

    try {
      const resposta = await api.get('/perguntas')
      let dados = resposta.data
      
      // Embaralha apenas na primeira vez
      dados = this.embaralhar(dados)
      dados.forEach(p => p.opcoes = this.embaralhar(p.opcoes))

      this.perguntas = dados
      this.indiceSalvo = 0
      this.acertosSalvos = 0
      this.respondidasSalvos = 0
    } catch (erro) {
      console.error('Erro ao buscar perguntas:', erro)
    } finally {
      this.carregando = false
    }
  }
})