let mic, fft;
let ramas = [];
let bases = [];
let micActivo = false;

//VARIABLES DE GENERACIÓN DE LÍNEAS

let margenYV;
let margenYH;
let margenXV;
let margenXH;

let cantLineasH;
let lineasH = [];

let cantLineasV;
let lineasV = [];

//FIN VARIABLES DE GENERACIÓN DE LÍNEAS

const threshold = 0.05;
const colores = [
  '#e63946', '#f1fa8c', '#a8dadc', '#457b9d',
  '#ffb4a2', '#b5e48c', '#b5179e', '#ff9f1c'
];

function setup() {

  //GENERACIÓN DE LÍNEAS

  cantLineasV = random(1, 2);
  cantLineasH = random(2, 5);

  margenXV = 600;
  margenYV = 100;

  margenXH = 600;
  margenYH = 300;

  //se crean las líneas verticales
  for (let i = 0; i < cantLineasV; i++){
    lineasV[i] = new LineaPrincipal(margenXV,margenYV);
  }

  //se crean las líneas horizontales
  for (let i = 0; i < cantLineasH; i++){
    lineasH[i] = new LineaHorizontal(margenXH,margenYH,cantLineasH,i);
  }

  //FIN GENERACIÓN DE LÍNEAS

  createCanvas(windowWidth, windowHeight);
  strokeCap(ROUND);

  mic = new p5.AudioIn();
  fft = new p5.FFT(); // ¡esto va fuera del callback!
  
  const boton = select('#startButton');
  boton.show();
  
  boton.mousePressed(() => {
    mic.start(() => {
      fft.setInput(mic);
      micActivo = true;
      boton.hide();
    });
  });

  const centroX = width / 2;
  const centroY = height / 2;
  const angulos = [-PI / 4, -PI / 2, -3 * PI / 4];
  for (let a of angulos) {
    bases.push({
      x1: centroX,
      y1: centroY,
      x2: centroX + cos(a) * 100,
      y2: centroY + sin(a) * 100
    });
  }
}

function draw() {
  background(240, 227, 206, 10);

 /* Estas son las tres líneas base que había antes
  stroke('#8d5524');
  strokeWeight(8);
  for (let b of bases) {
    line(b.x1, b.y1, b.x2, b.y2);
  }*/

  //GENERACIÓN DE LÍNEAS

  push();
  stroke(0);
  strokeWeight(1);

  //se dibujan las líneas verticales
  for(let i = 0; i < cantLineasV; i++){
    lineasV[i].dibujar();
  }

  //se dibujan las líneas verticales
  for(let i = 0; i < cantLineasH; i++){
    lineasH[i].dibujar();
  }
  pop();

  //FIN GENERACIÓN DE LÍNEAS

  if (!micActivo) return;

  let vol = mic.getLevel();
  let spectrum = fft.analyze();
  let graves = fft.getEnergy("bass");
  let agudos = fft.getEnergy("treble");

  if (vol > threshold) {
    for (let base of bases) {
      ramas.push(new Rama(base.x2, base.y2, vol, graves, agudos));
    }
  }

  for (let i = ramas.length - 1; i >= 0; i--) {
    ramas[i].actualizar();
    ramas[i].mostrar();
    if (ramas[i].terminada()) ramas.splice(i, 1);
  }
}

class Rama {
  constructor(x, y, vol, graves, agudos) {
    this.x = x;
    this.y = y;
    this.vol = vol;
    this.graves = graves;
    this.agudos = agudos;
    this.segmentos = [];
    this.alpha = 255;
    this.crearRama();
  }

  crearRama() {
    let direccion = -PI / 2 + map(this.agudos - this.graves, -255, 255, PI / 3, -PI / 3);
    let longitud = int(map(this.vol, 0, 0.3, 5, 12));
    let x = this.x;
    let y = this.y;

    for (let i = 0; i < longitud; i++) {
      let ang = direccion + random(-PI / 6, PI / 6);
      let largo = random(15, 40);
      let x2 = x + cos(ang) * largo;
      let y2 = y + sin(ang) * largo;
      this.segmentos.push({
        x1: x,
        y1: y,
        x2: x2,
        y2: y2,
        color: random(colores),
        weight: map(this.vol, 0, 0.3, 1, 5)
      });
      x = x2;
      y = y2;
    }
  }

  actualizar() {
    this.alpha -= 3;
  }

  mostrar() {
    for (let seg of this.segmentos) {
      stroke(seg.color + hex(this.alpha, 2));
      strokeWeight(seg.weight);
      line(seg.x1, seg.y1, seg.x2, seg.y2);
    }
  }

  terminada() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
