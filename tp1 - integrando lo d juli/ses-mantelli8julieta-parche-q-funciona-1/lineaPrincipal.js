class LineaPrincipal{
    constructor(margenX,margenY){
        this.x1 = random(margenX, windowWidth-margenX);
        this.x2 = random(margenX, windowWidth-margenX);
        this.y1 = random(margenY, (windowHeight/4)-margenY);
        this.y2 = random((height/4)*3, windowHeight-margenY);
    }

    dibujar(){
        push();
        stroke(0);
        pop();

        line(this.x1, this.y1, this.x2, this.y2);
    
    }
}