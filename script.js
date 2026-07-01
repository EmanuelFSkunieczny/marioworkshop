<<<<<<< HEAD
const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')

const start = document.querySelector('.start')
const gameOver = document.querySelector('.game-over')

// Elementos de Score
const currentScoreElement = document.getElementById('current-score')
const highScoreElement = document.getElementById('high-score')
const finalScoreValElement = document.getElementById('final-score-val')

const audioStart = new Audio('./src/audio/audio_theme.mp3')
const audioGameOver = new Audio('./src/audio/audio_gameover.mp3')

// Variável para guardar o ID do intervalo e poder cancelar corretamente
let loopInterval = null
let scoreInterval = null

// Pontuação
let score = 0
let highScore = localStorage.getItem('marioHighScore') || 0

// Atualiza o recorde inicial na tela
highScoreElement.textContent = highScore

// Flag para saber se o jogo está rodando
let running = false

// Flag para evitar detectar colisão logo após o restart
let ignoreCollision = false

// Lista de obstáculos (caminhos de imagem e alturas correspondentes)
const obstacles = [
  { src: './img/pipe.png', width: '80px', bottom: '0px' },
  { src: './img/pipe.png', width: '60px', bottom: '0px' }, // Cano menor
  { src: './img/pipe.png', width: '100px', bottom: '0px' } // Cano maior
]

// Função para mudar o obstáculo aleatoriamente
const randomizeObstacle = () => {
  const randomIndex = Math.floor(Math.random() * obstacles.length)
  const chosen = obstacles[randomIndex]

  pipe.src = chosen.src
  pipe.style.width = chosen.width
  pipe.style.bottom = chosen.bottom
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
  currentScoreElement.textContent = score

  pipe.classList.add('pipe-animation')
  randomizeObstacle()
  start.style.display = 'none'

  // audio
  audioStart.currentTime = 0
  audioStart.play().catch(() => { })

  // inicia o loop de colisão
  loopInterval = startLoop()

  // Inicia contagem de pontos (1 ponto a cada 100ms)
  scoreInterval = setInterval(updateScore, 100)
}

const restartGame = () => {
  // Para qualquer loop anterior
  if (loopInterval) clearInterval(loopInterval)
  if (scoreInterval) clearInterval(scoreInterval)

  loopInterval = null
  scoreInterval = null

  gameOver.style.display = 'none'
  score = 0
  currentScoreElement.textContent = score

  // Marca para ignorar colisão por um curto tempo enquanto o pipe se reposiciona
  ignoreCollision = true

  // Reset do pipe: remove estilo inline e reinicia animação
  pipe.style.left = ''
  pipe.style.right = ''
  pipe.classList.remove('pipe-animation')

  // Reset do mario
  mario.src = './img/mario.gif'
  mario.style.width = '150px'
  mario.style.bottom = '0'
  mario.style.marginLeft = ''
  mario.classList.remove('jump')

  // Esconde botão iniciar
  start.style.display = 'none'

  // Reset dos áudios
  audioGameOver.pause()
  audioGameOver.currentTime = 0

  audioStart.currentTime = 0
  audioStart.play().catch(() => { })

  // Aguarda o navegador processar a remoção da animação antes de adicioná-la de volta
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pipe.classList.add('pipe-animation')
      randomizeObstacle()
      running = true

      setTimeout(() => {
        ignoreCollision = false
      }, 600)

      // Inicia o loop de colisão
      loopInterval = startLoop()
      // Inicia contagem de pontos
      scoreInterval = setInterval(updateScore, 100)
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
      loopInterval = null
      scoreInterval = null

      // Remove animações corretamente
      pipe.classList.remove('pipe-animation')
      pipe.style.left = `${pipePosition}px`

      mario.classList.remove('jump')
      mario.style.bottom = `${marioPosition}px`

      // Muda imagem do Mario para game-over
      mario.src = './img/game-over.png'
      mario.style.width = '80px'
      mario.style.marginLeft = '50px'

      // Áudio
      audioStart.pause()

      audioGameOver.currentTime = 0
      audioGameOver.play().catch(() => { })

      setTimeout(() => {
        audioGameOver.pause()
      }, 7000)

      // Exibe pontuação final
      finalScoreValElement.textContent = score

      // Mostra tela de game over
      gameOver.style.display = 'flex'
    }
  }, 10)
}

// Inicia o loop de colisão
loopInterval = startLoop()

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
=======
const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')

const start = document.querySelector('.start')
const gameOver = document.querySelector('.game-over')

audioStart = new Audio('./src/audio/audio_theme.mp3')
audioGameOver = new Audio('./src/audio/audio_gameover.mp3')


const startGame = () => {
  pipe.classList.add('pipe-animation')
  start.style.display = 'none'

  // audio
  audioStart.play()
}

const restartGame = () => {
  gameOver.style.display = 'none'
  pipe.style.left = ''
  pipe.style.right = '0'
  mario.src = './src/img/mario.gif'
  mario.style.width = '150px'
  mario.style.bottom = '0'

  start.style.display = 'none'

  audioGameOver.pause()
  audioGameOver.currentTime = 0;

  audioStart.play()
  audioStart.currentTime = 0;

}

const jump = () => {
  mario.classList.add('jump')

  setTimeout(() => {
    mario.classList.remove('jump')
  }, 800)
}

const loop = () => {
  setInterval(() => {
    const pipePosition = pipe.offsetLeft
    const marioPosition = window
      .getComputedStyle(mario)
      .bottom.replace('px', ' ')

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      pipe.classList.remove('.pipe-animation')
      pipe.style.left = `${pipePosition}px`

      mario.classList.remove('.jump')
      mario.style.bottom = `${marioPosition}px`

      mario.src = './src/img/game-over.png'
      mario.style.width = '80px'
      mario.style.marginLeft = '50px'


      function stopAudioStart() {
        audioStart.pause()
      }
      stopAudioStart()

      audioGameOver.play()

      function stopAudio() {
        audioGameOver.pause()
      }
      setTimeout(stopAudio, 7000)

      gameOver.style.display = 'flex'

      clearInterval(loop)
    }
  }, 10)
}

loop()

document.addEventListener('keypress', e => {
  const tecla = e.key
  if (tecla === ' ') {
    jump()
  }
})

document.addEventListener('touchstart', e => {
  if (e.touches.length) {
    jump()
  }
})

document.addEventListener('keypress', e => {
  const tecla = e.key
  if (tecla === 'Enter') {
    startGame()
  }
>>>>>>> 79d76b62878c9477bb426ee0d4f3c8520097eeea
})