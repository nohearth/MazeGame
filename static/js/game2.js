
const fps = 30

const configTeclado = { prevent_repeat : true }
const evenTeclado = new window.keypress.Listener(this, configTeclado)


let canvas
let ctx
let sprite

let escenario = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,1,1,0,0],
  [0,0,1,1,1,1,1,0,0,0],
  [0,0,1,0,0,0,1,1,0,0],
  [0,0,1,1,1,0,0,1,0,0],
  [0,1,1,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,1,1,1,0],
  [0,1,1,1,0,0,1,0,0,0],
  [0,1,1,1,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
]

let color
const anchoFila = 32
const altoFila = 32
const green = '#035c0f'
const blue = '#3882d1'
const brown = '#a39b60'

function dibujarEscenario() {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if(escenario[y][x] === 1)
        color = brown
      else
        color = green

      ctx.fillStyle = color
      ctx.fillRect(x*anchoFila, y*altoFila,anchoFila,altoFila)
    }
  }
}

class protagonista {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.velocidad = 32

    this.dibujar = function () {
      ctx.drawImage(sprite, this.x, this.y)
    }

    this.dibujaTexto = function () {
      ctx.font = '30x impact'
      ctx.fillStyle = '#000'
      ctx.fillText('X: ' + this.x + ' Y: ' + this.y, 20, 20)
    }

    this.arriba = function () {
      if(escenario[this.y/velocidad-1][this.x/velocidad] === 1)
        this.y -= this.velocidad
    }

    this.abajo = function () {
      if(escenario[this.y/velocidad+1][this.x/velocidad] === 1)
        this.y += this.velocidad
    }

    this.derecha = function () {
      if(escenario[this.y/velocidad][this.x/velocidad+1] === 1)
        this.x += this.velocidad
    }

    this.izquierda = function () {
      if(escenario[this.y/velocidad][this.x/velocidad-1] === 1)
        this.x -= this.velocidad
    }
  }
}

let prota

function inicializar(){
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  sprite = new Image()
  sprite.src = "img/shinobu.png"
  prota = new protagonista(32, 32)

  setInterval( function() {
    principal()
  }, 1000/fps)
}

function borrarCanvas() {
  canvas.width = 320
  canvas.height = 320
}

function principal() {
  borrarCanvas()
  dibujarEscenario()

  prota.dibujar()
  prota.dibujaTexto()
}

function moverArriba() {
  prota.arriba()
}

function moverAbajo() {
  prota.abajo()
}
function moverDerecha() {
  prota.derecha()
}
function moverIzquierda() {
  prota.izquierda()
}

evenTeclado.simple_combo('w', moverArriba)
evenTeclado.simple_combo('s', moverAbajo)
evenTeclado.simple_combo('d', moverDerecha)
evenTeclado.simple_combo('a', moverIzquierda)