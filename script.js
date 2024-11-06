// Seleciona o elemento representando o personagem "estudante"
const estudante = document.querySelector(".estudante");

// Seleciona o elemento que exibirá a contagem de pontos
const contadorElement = document.getElementById("contador");

// Seleciona o contêiner principal do jogo
const jogo = document.querySelector(".jogo");

// Seleciona o elemento de música de fundo
const musicaFundo = document.getElementById("musica-fundo");

// Seleciona o contêiner onde as vidas serão exibidas
const vidasContainer = document.getElementById("vidas");

// Seleciona todos os elementos de obstáculos (cones) do jogo
const cones = document.querySelectorAll(".cone");

// Variáveis de estado do jogo
let contador = 0; // Contador de pontos do jogador
let vidas = 3; // Número inicial de vidas
let passouCone = false; // Verifica se o jogador passou pelo cone atual
let indiceConeAtual = 0; // Índice do obstáculo atualmente exibido
let intervaloObstaculos = 2000; // Tempo entre a exibição dos obstáculos, em milissegundos
let jogoAtivo = true; // Controla se o jogo está ativo

// Define a posição inicial do personagem e inicia a música de fundo
estudante.style.bottom = "-20px";
musicaFundo.play();

// Função para exibir as vidas na tela usando imagens
const exibirVidas = () => {
  vidasContainer.innerHTML = ""; // Limpa o contêiner de vidas
  for (let i = 0; i < vidas; i++) { // Para cada vida restante
    const img = document.createElement("img"); // Cria um elemento de imagem
    img.src = "assents/coracao.png"; // Define o caminho da imagem de vida
    img.classList.add("icone-vida"); // Adiciona uma classe CSS para estilização
    vidasContainer.appendChild(img); // Adiciona a imagem ao contêiner
  }
};

// Função que faz o personagem pular
const pulo = () => {
  if (!jogoAtivo) return; // Impede o pulo se o jogo acabou
  estudante.classList.add("pulo"); // Adiciona a classe de pulo

  setTimeout(() => {
    estudante.classList.remove("pulo"); // Remove a classe após 500ms
  }, 500);
};

// Função para definir a medalha com base na pontuação
const definirMedalha = () => {
  const medalha = document.getElementById("medalha");
  if (contador >= 30) { // Pontuação para a medalha de ouro
      medalha.src = "assents/ouro.png";
      medalha.style.display = "inline";
  } else if (contador >= 20) { // Pontuação para a medalha de prata
      medalha.src = "assents/prata.png";
      medalha.style.display = "inline";
  } else if (contador >= 1) { // Pontuação para a medalha de bronze
      medalha.src = "assents/bronze.png";
      medalha.style.display = "inline";
  } else {
      medalha.style.display = "none"; // Sem medalha se a pontuação for menor que 10
  }
}

// Função para tratar colisão quando as vidas chegam a zero
const colisao = () => {
  vidas--; // Reduz uma vida
  exibirVidas(); // Atualiza as vidas exibidas

  if (vidas <= 0) { // Verifica se o jogador perdeu todas as vidas
      jogoAtivo = false; // Finaliza o jogo
      definirMedalha(); // Exibe a medalha com base na pontuação

      const mensagemPerda = document.getElementById("mensagem-perda"); // Exibe a mensagem de perda
      mensagemPerda.style.display = "block";

      estudante.src = "assents/game-over.png"; // Define a imagem de game over para o personagem
      estudante.style.width = "80px";
      estudante.style.marginLeft = "40px";

      musicaFundo.pause(); // Pausa e reinicia a música de fundo
      musicaFundo.currentTime = 0;

      cones.forEach((cone) => { // Oculta todos os cones
          cone.style.display = "none";
      });
      contadorElement.style.display = "none"; // Oculta o contador de pontos
      clearInterval(loop); // Para o loop do jogo
  } else {
      // Pausa temporária dos cones para efeito visual de colisão
      cones.forEach((cone) => {
          cone.style.animation = "none"; // Pausa a animação do cone
          setTimeout(() => {
              if (jogoAtivo) cone.style.animation = ""; // Reinicia a animação se o jogo ainda estiver ativo
          }, 500);
      });
  }
};

// Função para alternar entre os obstáculos
const alternarObstaculos = () => {
  if (!jogoAtivo) return; // Impede a troca de obstáculos se o jogo acabou
  cones.forEach((cone) => cone.style.display = "none"); // Oculta todos os obstáculos
  indiceConeAtual = Math.floor(Math.random() * cones.length); // Seleciona aleatoriamente o próximo obstáculo
  cones[indiceConeAtual].style.display = "block"; // Exibe o obstáculo selecionado
};

// Loop principal do jogo
const loop = setInterval(() => {
  if (!jogoAtivo) return; // Impede a execução do loop se o jogo acabou

  // Obtém a posição do estudante e do obstáculo atual
  const posicacoEstudante = +window.getComputedStyle(estudante).bottom.replace("px", "");
  const coneAtual = cones[indiceConeAtual];
  const posicaoCone = coneAtual.offsetLeft;

  // Verifica se há colisão com o obstáculo atual
  if (posicaoCone <= 30 && posicaoCone > 0 && posicacoEstudante < 100) {
    colisao(); // Chama a função de colisão
  } else if (posicaoCone < 0 && !passouCone) { // Verifica se o jogador passou pelo cone
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
}, 16); // Intervalo do loop em milissegundos

// Event listener para o pulo ao pressionar qualquer tecla
document.addEventListener("keydown", pulo);

// Função para recarregar o jogo
function recarregar() {
  location.reload(); // Recarrega a página
}

// Event listener para recarregar o jogo ao pressionar "r" ou "R"
document.addEventListener("keydown", function (event) {
  if ((event.key === "r" || event.key === "R") && !jogoAtivo) {
    recarregar(); // Recarrega o jogo se ele não estiver ativo
  }
});

// Inicializa as imagens de vidas na tela e define o primeiro obstáculo
document.addEventListener("DOMContentLoaded", () => {
  exibirVidas(); // Exibe as imagens de vidas quando a página carrega
  alternarObstaculos(); // Define o primeiro obstáculo
});
