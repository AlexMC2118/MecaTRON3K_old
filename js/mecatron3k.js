/**
  @file Controlador principal del Juego MecaTRON-3000
  @author Miguel Jaque <mjaque@fundacionloyola.es>
  @license GPL v3 2021
**/

'use strict'

/**
  Controlador principal del juego.
**/
class Juego{
  /**
    Constructor de la clase Juego
  **/
  constructor(){
    this.vista = new Vista()
    this.modelo = new Modelo()
    this.generadorPalabras = null
    this.animador = null
    this.divPrincipal = null
    window.onload = this.iniciar.bind(this)
  }
  /**
    Pone en marcha el juego.
  **/
  iniciar(){
    console.log('Iniciando...')
    this.divPrincipal = document.getElementById('divPrincipal')
    this.vista.div = this.divPrincipal
    this.generadorPalabras = window.setInterval(this.generarPalabra.bind(this), 3000)
    this.animador = window.setInterval(this.vista.moverPalabras.bind(this.vista), 300)
    window.onkeypress = this.pulsar.bind(this)
  }

  generarPalabra(){
    let nuevaPalabra = this.modelo.crearPalabra()
    this.vista.dibujar(nuevaPalabra)
  }

  /**
    Evento de atención a la pulsación del teclado.

    Busca las palabras que tienen la letra pulsada y cambia su estado.
    Cambiando el estilo y moviendo las letras de un sitio a otro.
    @param {KeyboardEvent} evento Evento de pulsación del teclado.
  **/
  pulsar(evento){
    let letraPulsada = evento.key
    //Busco todas las palabras
    let palabras = this.divPrincipal.querySelectorAll('.palabra')
    for(let palabra of palabras){
      let span = palabra.children.item(0)
      let nodoTexto = palabra.childNodes[1]
      let textoRestante = nodoTexto.nodeValue
      let primeraLetraTextoRestante = textoRestante.charAt(0)
      if (letraPulsada == primeraLetraTextoRestante){
        span.textContent += letraPulsada
        nodoTexto.nodeValue = textoRestante.substring(1)

        //Si ha completado la palabra, la elimino y sumo puntos
        if (nodoTexto.nodeValue.length == 0){
          palabra.remove()
          this.modelo.sumarPunto(span.textContent.length)
        }
      }
      else{
        //Ha fallado, repongo el texto de la palabra
        nodoTexto.nodeValue = span.textContent + nodoTexto.nodeValue
        span.textContent = ''
      }
    }
  }
}

/**
  Clase Vista que muestra el juego.
**/
class Vista{
  constructor(){
    this.div = null   //Div donde se desarrolla el juego
  }
  /**
    Dibuja el área de juego.
    @param palabra {String} La nueva palabra.
  */
  dibujar(palabra){
    // <div class=palabra>Meca</div>
    let div = document.createElement('div')
    this.div.appendChild(div)
    let span = document.createElement('span')
    div.appendChild(span)
    div.appendChild(document.createTextNode(palabra))
    div.classList.add('palabra')
    div.style.top = '0px'
    div.style.left = Math.floor(Math.random() * 85) + '%'
  }
  /**
    Mueve las palabras del Juego
  **/
  moverPalabras(){
    //Busco todas las palabras del div
    let palabras = this.div.querySelectorAll('.palabra')

    //Para cada palabra, aumento su atributo top.
    for(let palabra of palabras){
      let top = parseInt(palabra.style.top)
      top += 5
      palabra.style.top = `${top}px`
      //Si ha llegado al final
      if (top >= 760)
        palabra.remove()
    }
  }
}

/**
  Modelo de datos del juego.
**/
class Modelo{
  constructor(){
      //Desarrollamos el array bidimensional
      this.palabras= new Array(3);
      this.palabras[0] = new Array(8);
      this.palabras[1] = new Array(7);
      this.palabras[2] = new Array(5);

      this.palabras[0][0]="ju";
      this.palabras[0][1]="fr";
      this.palabras[0][2]="fv";
      this.palabras[0][3]="jm";
      this.palabras[0][4]="fu";
      this.palabras[0][5]="jr";
      this.palabras[0][6]="jv";
      this.palabras[0][7]="fm";

      this.palabras[1][0]="fre";
      this.palabras[1][1]="jui";
      this.palabras[1][2]="fui";
      this.palabras[1][3]="vie";
      this.palabras[1][4]="mi";
      this.palabras[1][5]="mery";
      this.palabras[1][6]="huy";

      this.palabras[2][0]="juan";
      this.palabras[2][1]="remo";
      this.palabras[2][2]="foca";
      this.palabras[2][3]="dedo";
      this.palabras[2][4]="cate";

      this.puntuacion = 0;
      this.nivel = 0;
  }
  /**
    Devuelve una nueva palabra.
    Devuelve aleatoriamente unn elemento del array de palabras.
    @return {String} Palabra generada
  **/
  subirnivel(){
    this.nivel = Math.floor(this.puntuacion/10);
  }
  bajarnivel(){
    this.nivel--;
  }
  sumarPunto(puntos){
    this.puntuacion += parseFloat([Math.floor(puntos)]);
    if(this.nivel<2 && this.puntuacion -10 >= 0){
      this.subirnivel();
    }
    console.log(this.puntuacion)
  }
  crearPalabra(){
    //Agregamos [this.nivel] para entrar en el array bidimensional
    return this.palabras[this.nivel][Math.floor(Math.random() * this.palabras.length)]
  }
}

var app = new Juego()
