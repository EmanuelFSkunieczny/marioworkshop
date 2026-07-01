const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')

const start = document.querySelector('.start')
const gameOver = document.querySelector('.game-over')

// Elementos de Score
const currentScoreElement = document.getElementById('current-score')
const highScoreElement = document.getElementById('high-score')
const finalScoreValElement = document.getElementById('final-score-val')

// Variável para guardar o ID do intervalo e poder cancelar corretamente
let loopInterval = null
let scoreInterval = null
let speedInterval = null

// Pontuação
let score = 0
let highScore = localStorage.getItem('marioHighScore') || 0

// Velocidade (duração da animação em segundos — menor = mais rápido)
const BASE_SPEED = 2.0       // velocidade inicial
const MIN_SPEED = 0.6        // velocidade máxima (limite)
const SPEED_STEP = 0.05      // quanto diminui a cada tick
const SPEED_TICK_MS = 3000   // a cada 3 segundos fica mais rápido
let currentSpeed = BASE_SPEED

// Atualiza o recorde inicial na tela
highScoreElement.textContent = highScore

// Flag para saber se o jogo está rodando
let running = false

// Flag para evitar detectar colisão logo após o restart
let ignoreCollision = false

// Lista de obstáculos com tamanhos variados
const obstacles = [
  { src: './img/pipe.png', width: '80px', bottom: '0px' },   // Cano padrão
  { src: './img/pipe.png', width: '60px', bottom: '0px' },   // Cano fino
  { src: './img/pipe.png', width: '100px', bottom: '0px' },  // Cano largo
  { src: './img/pipe.png', width: '70px', bottom: '0px' },   // Cano médio-fino
  { src: './img/pipe.png', width: '90px', bottom: '0px' }    // Cano médio-largo
]

// Função para mudar o obstáculo aleatoriamente
const randomizeObstacle = () => {
  const randomIndex = Math.floor(Math.random() * obstacles.length)
  const chosen = obstacles[randomIndex]

  pipe.src = chosen.src
  pipe.style.width = chosen.width
  pipe.style.bottom = chosen.bottom
}

// Aplica a velocidade atual na animação do pipe
const applySpeed = () => {
  pipe.style.animationDuration = `${currentSpeed}s`
}

// Aumenta a velocidade gradualmente
const increaseSpeed = () => {
  if (!running) return
  if (currentSpeed > MIN_SPEED) {
    currentSpeed = Math.max(currentSpeed - SPEED_STEP, MIN_SPEED)
    applySpeed()
  }
}

const updateScore = () => {
  if (!running) return
  score += 1
  currentScoreElement.textContent = score

  // Atualiza recorde se passar a pontuação atual
  if (score > highScore) {
    highScore = score
    localStorage.setItem('marioHighScore', highScore)
    highScoreElement.textContent = highScore
  }
}

const startGame = () => {
  if (running) return // evita iniciar duas vezes

  running = true
  ignoreCollision = false
  score = 0
  currentSpeed = BASE_SPEED
  currentScoreElement.textContent = score

  pipe.classList.add('pipe-animation')
  applySpeed()
  randomizeObstacle()
  start.style.display = 'none'

  // inicia o loop de colisão
  loopInterval = startLoop()

  // Inicia contagem de pontos (1 ponto a cada 100ms)
  scoreInterval = setInterval(updateScore, 100)

  // Inicia aumento de velocidade gradual
  speedInterval = setInterval(increaseSpeed, SPEED_TICK_MS)
}

const restartGame = () => {
  // Para qualquer loop/intervalo anterior
  if (loopInterval) clearInterval(loopInterval)
  if (scoreInterval) clearInterval(scoreInterval)
  if (speedInterval) clearInterval(speedInterval)

  loopInterval = null
  scoreInterval = null
  speedInterval = null

  gameOver.style.display = 'none'
  score = 0
  currentSpeed = BASE_SPEED
  currentScoreElement.textContent = score

  // Marca para ignorar colisão por um curto tempo enquanto o pipe se reposiciona
  ignoreCollision = true

  // Reset do pipe: remove estilo inline e reinicia animação
  pipe.style.left = ''
  pipe.style.right = ''
  pipe.style.animationDuration = ''
  pipe.classList.remove('pipe-animation')

  // Reset do mario
  mario.src = './img/mario.gif'
  mario.style.width = '150px'
  mario.style.bottom = '0'
  mario.style.marginLeft = ''
  mario.classList.remove('jump')

  // Esconde botão iniciar
  start.style.display = 'none'

  // Aguarda o navegador processar a remoção da animação antes de adicioná-la de volta
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pipe.classList.add('pipe-animation')
      applySpeed()
      randomizeObstacle()
      running = true

      setTimeout(() => {
        ignoreCollision = false
      }, 600)

      // Inicia o loop de colisão
      loopInterval = startLoop()
      // Inicia contagem de pontos
      scoreInterval = setInterval(updateScore, 100)
      // Inicia aumento de velocidade
      speedInterval = setInterval(increaseSpeed, SPEED_TICK_MS)
    })
  })
}

const jump = () => {
  // Só pula se o jogo estiver rodando
  if (!running) return

  mario.classList.add('jump')

  setTimeout(() => {
    mario.classList.remove('jump')
  }, 800)
}

const startLoop = () => {
  // Controlar se o cano deu a volta para mudar de obstáculo
  let passedObstacle = false

  return setInterval(() => {
    if (ignoreCollision) return

    const pipePosition = pipe.offsetLeft
    const marioPosition = +window
      .getComputedStyle(mario)
      .bottom.replace('px', '')

    // Se o cano passar do Mario e estiver na esquerda da tela, troca o obstáculo para o próximo ciclo
    if (pipePosition < 0 && !passedObstacle) {
      passedObstacle = true
      // Espera um pouco e muda o obstáculo enquanto ele está invisível fora da tela
      setTimeout(() => {
        if (running) {
          randomizeObstacle()
        }
        passedObstacle = false
      }, 500)
    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      // Para o jogo
      running = false
      clearInterval(loopInterval)
      clearInterval(scoreInterval)
      clearInterval(speedInterval)
      loopInterval = null
      scoreInterval = null
      speedInterval = null

      // Remove animações corretamente
      pipe.classList.remove('pipe-animation')
      pipe.style.left = `${pipePosition}px`

      mario.classList.remove('jump')
      mario.style.bottom = `${marioPosition}px`

      // Muda imagem do Mario para game-over
      mario.src = './img/game-over.png'
      mario.style.width = '80px'
      mario.style.marginLeft = '50px'

      // Exibe pontuação final
      finalScoreValElement.textContent = score

      // Mostra tela de game over
      gameOver.style.display = 'flex'
    }
  }, 10)
}

// Tecla espaço para pular
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault()
    jump()
  }
})

// Tecla Enter para iniciar/reiniciar o jogo
document.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    if (!running) {
      if (gameOver.style.display === 'flex') {
        restartGame()
      } else {
        startGame()
      }
    }
  }
})

// Toque na tela (mobile)
document.addEventListener('touchstart', e => {
  if (e.touches.length) {
    jump()
  }
})