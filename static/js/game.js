//Mouse
let miCanvas
let ctx
const fps = 50
let sprite

const configTeclado = { prevent_repeat : true }
const evenTeclado = new window.keypress.Listener(this, configTeclado)

//Escenario
let color

const ancho = 50
const alto = 50

const green = '#34b356'
const blue = '#3882d1'
const brown = '#9e7a3c'

let escenario = [
  [2,1,1,0,1],
  [1,1,0,0,1],
  [1,0,0,1,1],
  [1,0,1,1,2],
  [0,0,1,2,2]
]

function dibujarEscenario() {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if(escenario[y][x] === 0)
        color = blue
      else if (escenario[y][x] === 1)
        color = brown
      else
        color = green

      ctx.fillStyle = color
      ctx.fillRect(x*ancho, y*alto,ancho,alto)
    }
  }
}

class prota {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.velocidad = 5

    this.dibujar = function () {
      ctx.drawImage(sprite, this.x, this.y)
    }

    this.dibujaTexto = function () {
      ctx.font = '30x impact'
      ctx.fillStyle = '#000'
      ctx.fillText('X: ' + this.x + ' Y: ' + this.y, 20, 20)
    }

    this.arriba = function () {
      this.y -= this.velocidad
      console.log('te has movido')
    }

    this.abajo = function () {
      this.y += this.velocidad
    }

    this.derecha = function () {
      this.x += this.velocidad
    }

    this.izquierda = function () {
      this.x -= this.velocidad
    }
  }
}

let personaje = function(x, y) {
  this.x = x
  this.y = y
  this.derecha = true

  this.dibujar = function() {
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(this.x, this.y, 20, 20)
  }

  this.mover = function(speed) {

    if(this.derecha === true) {
      if(this.derecha === true && this.x < 470) {
        this.x+= speed
      }
      else {
        this.derecha = false
      }
    }
    else {
      if(this.derecha === false && this.x > 10) {
        this.x-= speed
      }
      else {
        this.derecha = true
      }
    }
  }
}

//personajes

let per1 = new personaje(10, 10)
let per2 = new personaje(10, 60)
let per3 = new personaje(10, 100)

let protagonista = new prota(30, 30)

function inicializar(){
  miCanvas = document.getElementById('canvas')
  ctx = miCanvas.getContext('2d')
  
  sprite = new Image()
  sprite.src = "img/shinobu.png"

  setInterval( function() {
    principal()
  }, 1000/fps)

  miCanvas.addEventListener('mousedown', clickRaton, false)
  miCanvas.addEventListener('mousemove', mouseMove, false)

}

function borrarCanvas() {
  miCanvas.width = 500
  miCanvas.height = 300
}

function principal() {
  borrarCanvas()
  
  per1.dibujar()
  per2.dibujar()
  per3.dibujar()

  dibujarEscenario()

  protagonista.dibujar()
  protagonista.dibujaTexto()

  per1.mover(2)
  per2.mover(5)
  per3.mover(10)

  //console.log('funcion')
}

function mouseMove(e) {
  let x, y
  x = e.pageX
  y = e.pageY
  console.log('X: '+x+' Y: '+y)
}

function clickRaton(e) {
  console.log('Mouse pulsado')
}

//Teclado
function moverArriba() {
  protagonista.arriba()
}

function moverAbajo() {
  protagonista.abajo()
}
function moverDerecha() {
  protagonista.derecha()
}
function moverIzquierda() {
  protagonista.izquierda()
}

function comboEspecial() {
  console.log('Ataque especial')
}

evenTeclado.simple_combo('w', moverArriba)
evenTeclado.simple_combo('s', moverAbajo)
evenTeclado.simple_combo('d', moverDerecha)
evenTeclado.simple_combo('a', moverIzquierda)

//evenTeclado.sequence_combo('a b c', comboEspecial)
