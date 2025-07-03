class LineaHorizontal{
    constructor(margenX,margenY,cantLineas,numLinea){
        this.x1 = random(margenX, windowWidth/2);
        this.x2 = random(windowWidth/2, windowWidth-margenX);
        this.y1 = random(numLinea*100, numLinea*120);
        this.y2 = random(numLinea*100, numLinea*120);
    }

    dibujar(){
        push();
        stroke(0);
        pop();

        line(this.x1, this.y1, this.x2, this.y2);
    
    }
}