const startButton = document.querySelector("#start")
const dealerArea = document.querySelector("#cartasDoDealer")
const playerArea = document.querySelector("#cartasDoJogador")
const buttons = document.querySelector("#buttons")
const outraCarta = document.querySelector("#outraCarta")
const passar = document.querySelector("#passar")
const soma = document.querySelector("#soma")
const baralho = gerarCartasEmbaralhadas()
const somaDealer = document.querySelector("#somaDealer")
const intervalo = 600
let [countPlayer, countDealer, turno] = [0, 0, 0]

function gerarCartasEmbaralhadas() {
  const baralho = []
  for (let carta = 0; carta < 11; carta++) {
    for (let naipe = 0; naipe < 4; naipe++) {
      baralho.push(carta + 1)
    }
  }
  return baralho.sort(() => (Math.random() > 0.5 ? 1 : -1))
}

startButton.onclick = function () {
  this.style.visibility = "hidden"
  const distribuirCartas = setInterval(() => {
    turno++ % 2 != 0 ? darCartaPlayer() : darCartaDealer()
  }, intervalo)
  setTimeout(() => {
    clearInterval(distribuirCartas)
    buttons.style.visibility = "visible"
    soma.style.visibility = "visible"
    somaDealer.style.visibility = "visible"
  }, intervalo * 3)
}

function darCartaDealer() {
  let carta = document.createElement("div")
  carta.className = "carta"
  carta.innerText = baralho.shift()
  if (turno === 1) somaDealer.innerText = Number(carta.innerText)
  if (turno >= 3) carta.style.contentVisibility = "hidden"
  countDealer += Number(carta.innerText)
  dealerArea.appendChild(carta)
}

function darCartaPlayer() {
  let carta = document.createElement("div")
  carta.className = "carta"
  carta.innerText = baralho.shift()
  countPlayer += Number(carta.innerText)
  soma.innerText = countPlayer
  playerArea.appendChild(carta)
  if (countPlayer >= 21) dealerJoga()
}

outraCarta.onclick = () => {
  turno++
  darCartaPlayer()
}
passar.onclick = () => {
  turno++
  dealerJoga()
}

function dealerJoga() {
  buttons.style.visibility = "hidden"
  const dealerPensando = setInterval(() => {
    const chance = () => Math.round(Math.random() * 100)
    if (countDealer >= 19) DealerPassa()
    if (countDealer <= 10) {
      darCartaDealer()
    } else if (countDealer <= 15) {
      chance() > 75 ? DealerPassa() : darCartaDealer()
    } else if (countDealer <= 18) {
      chance() > 33 ? DealerPassa() : darCartaDealer()
    }
  }, intervalo * 2)

  function DealerPassa() {
    clearInterval(dealerPensando)
    document.querySelectorAll(".carta").forEach((element) => {
      element.style.contentVisibility = "visible"
    })
    somaDealer.innerText = countDealer
    setTimeout(() => {
      buttons.innerText = checarVencedor()
      buttons.className = "fim"
      buttons.onclick = () => location.reload()
      buttons.style.visibility = "visible"
    }, intervalo * 2.5)
  }
}

function checarVencedor() {
  if ((countDealer > 21) & (countPlayer < countDealer)) {
    return `O vencedor é o Jogador, com ${countPlayer} pontos`
  }
  if ((countPlayer <= 21) & (countDealer <= 21) & (countPlayer > countDealer)) {
    return `O vencedor é o Jogador, com ${countPlayer} pontos`
  }
  return countPlayer === countDealer
    ? "Empate"
    : `O vencedor é o Dealer, com ${countDealer} pontos`
}
