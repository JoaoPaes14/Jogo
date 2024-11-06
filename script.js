const estudante = document.querySelector(".estudante");
const contadorElement = document.getElementById("contador");
const jogo = document.querySelector(".jogo");
const musicaFundo = document.getElementById("musica-fundo");
const vidasContainer = document.getElementById("vidas");
const cones = document.querySelectorAll(".cone"); 

let contador = 0;
let vidas = 3; // Número inicial de vidas
let passouCone = false;
let indiceConeAtual = 0; // Índice do obstáculo atualmente exibido
let intervaloObstaculos = 2000; // Tempo em milissegundos entre a exibição dos obstáculos
let jogoAtivo = true; // Variável para controlar o estado do jogo

estudante.style.bottom = "-20px";
musicaFundo.play();

// Função para exibir as vidas usando imagens
const exibirVidas = () => {
  vidasContainer.innerHTML = ""; // Limpa o contêiner de vidas
  for (let i = 0; i < vidas; i++) {
    const img = document.createElement("img");
    img.src = "assents/coracao.png"; // Caminho da imagem de vida
    img.classList.add("icone-vida"); // Classe CSS para ajustar o estilo da imagem
    vidasContainer.appendChild(img);
  }
};

const pulo = () => {
  if (!jogoAtivo) return; // Impede o pulo se o jogo acabou
  estudante.classList.add("pulo");

  setTimeout(() => {
    estudante.classList.remove("pulo");
  }, 500);
};

// Função que executa quando o jogador colide com um obstáculo
const colisao = () => {
  vidas--; // Reduz uma vida
  exibirVidas(); // Atualiza a exibição de vidas

  if (vidas <= 0) {
    // Se as vidas acabarem, o jogo termina
    jogoAtivo = false; // Marca o jogo como inativo
    const mensagemPerda = document.getElementById("mensagem-perda");
    mensagemPerda.style.display = "block";

    estudante.src = "assents/game-over.png";
    estudante.style.width = "80px";
    estudante.style.marginLeft = "40px";

    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    // Oculta todos os cones imediatamente após a derrota
    cones.forEach((cone) => {
      cone.style.display = "none";
    });
    contadorElement.style.display = "none";
    // Interrompe completamente o loop do jogo
    clearInterval(loop);
  } else {
    // Pausa temporariamente todos os cones para dar uma chance ao jogador
    cones.forEach((cone) => {
      cone.style.animation = "none";
      setTimeout(() => {
        if (jogoAtivo) cone.style.animation = ""; // Reinicia a animação do cone apenas se o jogo estiver ativo
      }, 500);
    });
  }
};

// Função para alternar entre os obstáculos
const alternarObstaculos = () => {
  if (!jogoAtivo) return; // Impede a troca de obstáculos se o jogo acabou
  cones.forEach((cone) => cone.style.display = "none"); // Oculta todos os obstáculos
  indiceConeAtual = Math.floor(Math.random() * cones.length); // Sorteia o próximo obstáculo
  cones[indiceConeAtual].style.display = "block"; // Exibe o obstáculo sorteado
};

// Loop principal do jogo
//let passouCone = false; // Garante que a variável seja resetada no momento certo

// Loop principal do jogo
const loop = setInterval(() => {
  if (!jogoAtivo) return; // Impede a execução do loop se o jogo acabou

  const posicacoEstudante = +window.getComputedStyle(estudante).bottom.replace("px", "");
  const coneAtual = cones[indiceConeAtual];
  const posicaoCone = coneAtual.offsetLeft;

  // Verifica colisão para o obstáculo atual
  if (posicaoCone <= 30 && posicaoCone > 0 && posicacoEstudante < 100) {
    colisao(); // Chama a função de colisão
  } else if (posicaoCone < 0 && !passouCone) {
    contador++; // Incrementa a pontuação
    contadorElement.textContent = contador; // Atualiza a pontuação na tela
    passouCone = true; // Marca que o jogador passou o cone

    // Alterna para o próximo obstáculo após uma pausa
    setTimeout(() => {
      if (jogoAtivo) { // Verifica se o jogo ainda está ativo antes de alternar obstáculos
        passouCone = false; // Reseta a variável para que a próxima colisão seja registrada corretamente
        alternarObstaculos(); // Chama a função para trocar o obstáculo
      }
    }, intervaloObstaculos);
  }
}, 16);

document.addEventListener("keydown", pulo);

// Função para recarregar o jogo
function recarregar() {
  location.reload();
}

document.addEventListener("keydown", function (event) {
  if ((event.key === "r" || event.key === "R") && !jogoAtivo) {
    recarregar();
  }
});

// Inicializa as imagens de vidas na tela e define o primeiro obstáculo
document.addEventListener("DOMContentLoaded", () => {
  exibirVidas(); // Exibe as imagens de vidas quando a página carrega
  alternarObstaculos(); // Define o primeiro obstáculo
});