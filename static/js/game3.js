
const fps = 30

const configTeclado = { prevent_repeat : false }
const evenTeclado = new window.keypress.Listener(this, configTeclado)


let canvas
let ctx
let antX, antY, actX, actY
let sprite, sprite_enemy, alter_sprite, shadow_cam
let tileset
let alterPower = false
let enemigos = []
let muerte = false, victoria = false
let contFrame = 0
let escenario = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,1,1,1,1,0,0,1,1,0],
  [0,0,1,1,1,1,1,0,0,1,0,0,1,0,0],
  [0,0,1,0,0,0,1,1,0,1,1,1,1,0,0],
  [0,0,1,1,1,0,0,1,0,0,0,1,0,0,0],
  [0,1,1,0,0,0,0,1,0,0,0,1,0,0,0],
  [0,0,1,0,0,0,1,1,1,0,0,1,1,1,0],
  [0,1,1,1,0,0,1,0,0,0,2,0,0,1,0],
  [0,1,1,3,0,0,1,0,0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

const anchoFila = 32
const altoFila = 32

class escena {
  constructor(x,y, tamX, tamY) {
    this.x = x
    this.y = y
    this.tamX = tamX
    this.tamY = tamY

    this.dibujarEscenario = function() {
      for (let y = 0; y < this.tamY; y++) {
        for (let x = 0; x < this.tamX; x++) {
          let tile = escenario[y][x]
          ctx.drawImage(tileset,tile*32,0,32,32,x*anchoFila, y*altoFila,anchoFila,altoFila)
        }
      }
    }
  }
}

class camera {
  constructor(x,y, tam) {
    this.x = x
    this.y = y
    this.tam = tam
    this.posX = 

    this.dibujarCamara = function() {
      ctx.drawImage(shadow_cam,(prota.posX()-1)*anchoFila, (prota.posY()-1)*altoFila, anchoFila*this.tam, altoFila*this.tam)
    }

    this.dibujarAlterCamera = function() {
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 11; j++) {
          if(j >= (prota.posY()-1+this.tam) || j < prota.posY()-1)
            if(Number.isInteger(prota.posY()))
              ctx.drawImage(dark,i*anchoFila, j*altoFila,anchoFila, altoFila)
            else {
              ctx.drawImage(dark,i*anchoFila, (j-.5)*altoFila,anchoFila, altoFila)
            }

          if(i >= (prota.posX()-1+this.tam) || i < prota.posX()-1)
            if(Number.isInteger(prota.posX()))
              ctx.drawImage(dark,i*anchoFila, j*altoFila,anchoFila, altoFila)
            else
              ctx.drawImage(dark,(i-.5)*anchoFila+.5, j*altoFila,anchoFila, altoFila)
        } 
      }
    }

    this.dibujarDeathCamera = function() {
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 10; j++) {
          ctx.drawImage(dark,i*anchoFila, j*altoFila,anchoFila, altoFila)
        }
      }
    }
  }
}

class enemigo {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 1/2
    this.direccion = 0
    this.frame = 15
    this.frameAnimation = 4
    this.frame_skip = 0
    this.frame_skipSprite = 0
    this.frameSprite = 0

    this.cambiarFotograma = function() {
      if(this.frameSprite < 3)
        this.frameSprite++
      else
        this.frameSprite = 0
    }

    this.dibujar = function () {
      
      if(this.frame_skipSprite < this.frameAnimation)
        this.frame_skipSprite++
      else {
        this.frame_skipSprite = 0
        this.cambiarFotograma()
      }
      ctx.drawImage(sprite_enemy,this.frameSprite*20,0,20,20,this.x*anchoFila, this.y*altoFila, anchoFila,altoFila)
    }

    this.collision = function (a, b) {

      let col = false
      if(Number.isInteger(b) && Number.isInteger(a))
        {
          if (escenario[b][a] === 0){
              col = true
          } 
        }
      return col 
    }

    this.mover = function () {
      prota.collisionEnemy(this.x, this.y)
      if(this.frame_skip < this.frame)
        this.frame_skip++
      else {

        this.frame_skip = 0
        if(Number.isInteger(this.x) && Number.isInteger(this.y))
          this.direccion = Math.floor(Math.random()*4)
        
        switch (this.direccion) {
          case 0:
            //Arriba
            antY = this.y
            if(this.collision(this.x, this.y-1) !== true)
              {  
                this.y-=this.speed
              }
            break;
          case 1:
            //Abajo
            antY = this.y
            if(this.collision(this.x, this.y+1) !== true)
              {
                this.y+=this.speed
              }
            break;
          case 2:
            //Derecha
            antX = this.x
            if(this.collision(this.x+1, this.y) !== true)
              {
                this.x+=this.speed
              }
            break;
          default:
            //Izquierda
            antX = this.x
            if(this.collision(this.x-1, this.y) !== true)
              {
                this.x-=this.speed
              }
            break;
        }
        //console.log("============================")
      }
    }
  }
}

class protagonista {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.powerActivated = 0
    this.frameSprite = 0
    this.frame_skipSprite = 0
    this.frameAnimation = 10
    this.frameEnd = 1
    this.velocidad = 0.5
    this.key = false
    actX = this.x
    actY = this.y

    this.posX = function() {
      return this.x
    }

    this.posY = function() {
      return this.y
    }

    this.cambiarFotograma = function(val) {
      if(!val)
        {
          if(this.frameSprite < 3)
            this.frameSprite++
          this.powerActivated = 1
        }
      if(val)
        {
          if(this.frameSprite > 0)
            this.frameSprite--
          this.powerActivated = 0
        }
    }

    //Sprite base
    this.dibujar = function () {
     
      if(this.frame_skipSprite < this.frameAnimation)
        this.frame_skipSprite++
      else {
        this.frame_skipSprite = 0
        this.cambiarFotograma(true)
      }
      ctx.drawImage(alter_sprite, this.frameSprite*32,0,32,32,this.x*anchoFila, this.y*altoFila, anchoFila,altoFila)
    }

    //Sprite habilidad
    this.dibujarAlter = function () {
      if(this.frame_skipSprite < this.frameAnimation)
        this.frame_skipSprite++
      else {
        this.frame_skipSprite = 0
        this.cambiarFotograma(false)
      }
      ctx.drawImage(alter_sprite, this.frameSprite*32,0,32,32,this.x*anchoFila, this.y*altoFila, anchoFila,altoFila)
    }

    //Activar habilidad
    this.shadowPower = function () {
      if(!alterPower)
        alterPower = true
      else 
        alterPower = false
    }

    //Indicador de posición
    this.dibujaTexto = function () {
      ctx.font = '30x impact'
      ctx.fillStyle = '#000'
      ctx.fillText('X: ' + this.x + ' Y: ' + this.y, 20, 20)
    }

    //Verificar si existe colision con enemigos
    this.collisionEnemy = function(a,b) {
      if(this.x == a && this.y == b) {
        if(this.powerActivated === 0) {
          muerte = true
          console.log("Has muerto")
        }
        else {
        }
      }
    }

    this.collisionDoor = function() {
      
      if(Number.isInteger(this.x))
        if(escenario[Math.floor(this.y)][this.x] === 2) {
          if(this.key) {
            console.log(contFrame)
            if(contFrame < this.frameEnd)
            contFrame++
            else {
              contFrame = 0
              victoria = true
              console.log("Has ganado")
            }
          }
          else
            console.log("You need a key")
        }
    }

    this.collisionKey = function() {
      if(Number.isInteger(this.x))
        if(escenario[Math.floor(this.y)][this.x] === 3) {
          escenario[Math.floor(this.y)][this.x] = 1
          this.key = true
        }
    }

    this.collision = function (a, b) {
      let col = false
      
      if(Number.isInteger(b) && Number.isInteger(a))
        {
          if (escenario[a][b] === 0){
            col = true
          }
        }
      else {
        if(!Number.isInteger(b) && Number.isInteger(a)) {
          if(b === actX)
            if(escenario[a][Math.round(b)] !== 0 && escenario[a][Math.floor(b)] !== 0)
                col = false
              else {
                col = true
              }
        }
        if(!Number.isInteger(a) && Number.isInteger(b)) {
          if(a === actY)
            if(escenario[Math.round(a)][b] !== 0 && escenario[Math.floor(a)][b] !== 0)
              col = false
            else {
              col = true
            }
        }
      }
      return col 
    }

    //Movimientos
    this.arriba = function () {
      actY = this.y - this.velocidad
      if(this.collision(this.y-1, this.x) !== true) {
        this.y -= this.velocidad
        this.collisionKey()
        this.collisionDoor()
      }
    }

    this.abajo = function () {
      actY = this.y + this.velocidad
      if(this.collision(this.y+1, this.x) !== true) {
        this.y += this.velocidad
        this.collisionKey()
        this.collisionDoor()
      }
    }

    this.derecha = function () {
      actX = this.x + this.velocidad
      if(this.collision(this.y, this.x+1) !== true) {
        this.x += this.velocidad
        this.collisionKey()
        this.collisionDoor()
      }
    }

    this.izquierda = function () {
      actX = this.x - this.velocidad
      if(this.collision(this.y, this.x-1) !== true) {
        this.x -= this.velocidad
        this.collisionKey()
        this.collisionDoor()
      }
    }
  }
}

let prota
let scene
let cam
let dark

//Funcion principal
function inicializar(){
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  scene = new escena(1,1,15,10)
  cam = new camera(1,1,3)

  dark = new Image()
  dark.src = "img/darkness.png"
  tileset = new Image()
  tileset.src = "img/tileset.png"

  sprite = new Image()
  sprite.src = "img/shinobu.png"
  shadow_cam = new Image()
  shadow_cam.src = "img/camera.png" 
  alter_sprite = new Image()
  alter_sprite.src = "img/poder.png"
  sprite_enemy = new Image()
  sprite_enemy.src = "img/dark.png"

  prota = new protagonista(1, 1)

  enemigos.push(new enemigo(2,8))
  enemigos.push(new enemigo(8,6))
  //enemigos.push(new enemigo())

  setInterval( function() {
    principal()
  }, 1000/fps)
}

function borrarCanvas() {
  canvas.width = 480
  canvas.height = 320
}

function resetLevel() {
  alterPower = false
  escenario[8][3] = 3
  muerte = false
  victoria = false
  prota.key = false
  prota.x = 1
  prota.y = 1
}

function principal() {
  borrarCanvas()
  scene.dibujarEscenario()

  for (let i = 0; i < enemigos.length; i++) {
    enemigos[i].mover()
    enemigos[i].dibujar()
  }
  cam.dibujarAlterCamera()
  
  if(!alterPower)
    prota.dibujar()
  else
    prota.dibujarAlter()
  prota.dibujaTexto()

  if(muerte || victoria)
    cam.dibujarDeathCamera()

  cam.dibujarCamara()
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
function activarHabilidad() {
  prota.shadowPower()
}

evenTeclado.simple_combo('w', moverArriba)
evenTeclado.simple_combo('s', moverAbajo)
evenTeclado.simple_combo('d', moverDerecha)
evenTeclado.simple_combo('a', moverIzquierda)
evenTeclado.simple_combo('m', activarHabilidad)