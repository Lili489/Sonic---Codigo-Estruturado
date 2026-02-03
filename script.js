const sonic = document.querySelector('.sonic');
const eggman = document.querySelector('.eggman');
const gameOverText = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');

let sonicX = 100;
let isJumping = false;
let isGameOver = false;
let eggmanLives = 3;
let canTakeDamage = true;

// Mostrar vidas do vilão
const livesText = document.createElement('div');
livesText.style.position = 'absolute';
livesText.style.top = '10px';
livesText.style.right = '10px';
livesText.style.color = 'white';
livesText.style.fontSize = '18px';
livesText.style.fontFamily = 'Arial, sans-serif';
livesText.innerText = `Vidas do Vilão: ${eggmanLives}`;
document.querySelector('.gameplay').appendChild(livesText);

// Movimento do Sonic
document.addEventListener('keydown', (event) => {
  if (isGameOver) return;

  if (event.code === 'ArrowRight') {
    sonicX += 15;
    if (sonicX > 900 - 150) sonicX = 900 - 150;
    sonic.style.left = sonicX + 'px';
    sonic.style.transform = 'scaleX(1)';
  }
  if (event.code === 'ArrowLeft') {
    sonicX -= 15;
    if (sonicX < 0) sonicX = 0;
    sonic.style.left = sonicX + 'px';
    sonic.style.transform = 'scaleX(-1)';
  }
  if ((event.code === 'ArrowUp' || event.code === 'Space') && !isJumping) {
    jump();
  }
});

// Função de pulo
function jump(bounce = false) {
  isJumping = true;
  let position = parseInt(sonic.style.bottom) || 80;
  let peak = bounce ? position + 120 : 240;
  let goingDown = false;

  const interval = setInterval(() => {
    if (position >= peak) goingDown = true;

    if (!goingDown) {
      position += 10;
      sonic.style.bottom = position + 'px';
    } else {
      position -= 10;
      sonic.style.bottom = position + 'px';
      checkCollision();
    }

    if (position <= 80) {
      clearInterval(interval);
      isJumping = false;
      sonic.style.bottom = '80px';
    }
  }, 20);
}

// Detecção de colisão
function checkCollision() {
  if (!canTakeDamage || isGameOver) return;

  const sonicRect = sonic.getBoundingClientRect();
  const eggmanRect = eggman.getBoundingClientRect();

  const hitFromTop =
    sonicRect.bottom >= eggmanRect.top + 10 &&
    sonicRect.bottom <= eggmanRect.top + 60 &&
    sonicRect.right > eggmanRect.left + 20 &&
    sonicRect.left < eggmanRect.right - 20;

  if (hitFromTop && isJumping) {
    canTakeDamage = false;
    eggmanLives--;
    livesText.innerText = `Vidas do Vilão: ${eggmanLives}`;

    eggman.style.transition = 'filter 0.1s';
    eggman.style.filter = 'brightness(3) saturate(2)';
    setTimeout(() => {
      eggman.style.filter = 'brightness(1)';
    }, 200);

    jump(true);

    setTimeout(() => {
      canTakeDamage = true;
    }, 800);

    if (eggmanLives <= 0) {
      explodeEggman();
    }
  }
}

// Explosão do vilão com GIF animado, posição corrigida
function explodeEggman() {
  const gameplay = document.querySelector('.gameplay');

  // Esconde Eggman
  eggman.style.display = 'none';

  // Criar GIF de explosão
  const explosion = document.createElement('img');
  explosion.src = './Arquivos/explosion.gif'; // GIF animado
  explosion.classList.add('explosion');
  gameplay.appendChild(explosion);

  // Posiciona baseado no offset do Eggman
  explosion.style.position = 'absolute';
  explosion.style.width = eggman.offsetWidth + 'px';
  explosion.style.left = eggman.offsetLeft + 'px';
  explosion.style.bottom = '80px'; // altura da grama
  explosion.style.zIndex = 50;

  // Mensagem de vitória e botão
  setTimeout(() => {
    gameOverText.innerText = 'VOCÊ VENCEU!';
    gameOverText.style.color = 'yellow';
    gameOverText.style.opacity = '1';
    restartButton.style.display = 'block';
    isGameOver = true;
  }, 500);
}

// Reinício do jogo
restartButton.addEventListener('click', () => {
  location.reload();
});