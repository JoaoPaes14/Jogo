const estudante = document.querySelector(".estudante");
const contadorElement = document.getElementById("contador");
const jogo = document.querySelector(".jogo");
const musicaFundo = document.getElementById("musica-fundo");
const vidasContainer = document.getElementById("vidas");
const cones = document.querySelectorAll(".cone"); // Seleciona todos os cones

let contador = 0;
let vidas = 3; // Número inicial de vidas
let passouCone = false;
let indiceConeAtual = 0; // Índice do obstáculo atualmente exibido
let intervaloObstaculos = 2000; // Tempo em milissegundos entre a exibição dos obstáculos

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
    const mensagemPerda = document.getElementById("mensagem-perda");
    mensagemPerda.style.display = "block";

    estudante.src = "assents/game-over.png";
    estudante.style.width = "80px";
    estudante.style.marginLeft = "40px";

    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    clearInterval(loop);
  } else {
    // Pausa temporariamente todos os cones para dar uma chance ao jogador
    cones.forEach((cone) => {
      cone.style.animation = "none";
      setTimeout(() => {
        cone.style.animation = ""; // Reinicia a animação do cone
      }, 500);
    });
  }
};

// Função para alternar entre os obstáculos
const alternarObstaculos = () => {
  cones.forEach((cone) => cone.style.display = "none"); // Oculta todos os obstáculos
  indiceConeAtual = Math.floor(Math.random() * cones.length); // Sorteia o próximo obstáculo
  cones[indiceConeAtual].style.display = "block"; // Exibe o obstáculo sorteado
};

// Loop principal do jogo
const loop = setInterval(() => {
  const posicacoEstudante = +window.getComputedStyle(estudante).bottom.replace("px", "");

  const coneAtual = cones[indiceConeAtual];
  const posicaoCone = coneAtual.offsetLeft;

  // Verifica colisão para o obstáculo atual
  if (posicaoCone <= 30 && posicaoCone > 0 && posicacoEstudante < 100) {
    colisao(); // Chama a função de colisão
  } else if (posicaoCone < 0 && !passouCone) {
    contador++;
    contadorElement.textContent = contador;
    passouCone = true;

    // Alterna para o próximo obstáculo após uma pausa
    setTimeout(() => {
      passouCone = false;
      alternarObstaculos(); // Chama a função para trocar o obstáculo
    }, intervaloObstaculos);
  }
}, 16);

document.addEventListener("keydown", pulo);

// Função para recarregar o jogo
function recarregar() {
  location.reload();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "r" || event.key === "R") {
    recarregar();
  }
});

// Inicializa as imagens de vidas na tela e define o primeiro obstáculo
document.addEventListener("DOMContentLoaded", () => {
  exibirVidas(); // Exibe as imagens de vidas quando a página carrega
  alternarObstaculos(); // Define o primeiro obstáculo
});
