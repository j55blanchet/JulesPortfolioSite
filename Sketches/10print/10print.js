

class LineDrawer {
    constructor(x, y, destX, destY, stepPercent) {
        this.ox = x;
        this.oy = y;
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.stepPercent = stepPercent;
        this.percent = 0;
    }

    draw(sketch) {
        if (this.percent > 1) {
            return;
        }
        let nx = this.ox + this.percent * (this.destX - this.ox);
        let ny = this.oy + this.percent * (this.destY - this.oy);

        sketch.line(this.x, this.y, nx, ny);

        this.x = nx;
        this.y = ny;
        this.percent = this.percent + this.stepPercent;
    }

    isComplete() {
        return this.percent > 1;
    }
}

var tenPrint = new p5((sketch) => {

    let darkColor = sketch.color(30, 30, 30);
    let lightColor = sketch.color(230, 230, 230);

    let markSize = 70;
    let lineWeight = 2;

    let lineStepPercent = 0.04;

    let lineMakers = [];
    
    let maxSimultaneous = 1000;

    sketch.setup = function() {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        sketch.background(darkColor);

    }
    
    let x = 0, y = 0;
    sketch.frameRate(240);
    sketch.draw = function() {

        sketch.fill(darkColor);
        sketch.noStroke();
        sketch.rect(x, y, markSize, markSize);

        sketch.stroke(lightColor);
        sketch.strokeWeight(lineWeight);
        lineMakers.forEach((m) => {
            m.draw(sketch);
        })

        // lineMakers = lineMakers.filter((m) => {
        //     m.isComplete();
        // })

        lineMakers = lineMakers.filter((val) => {
            return !val.isComplete();
        });

        if (lineMakers.length > maxSimultaneous - 1) {
            return;
        }

        let rNum = Math.random();
        if (rNum < 0.25) {
            lineMakers.push(
                new LineDrawer (x, y, x + markSize, y + markSize, lineStepPercent)
            );
        } else if (rNum < 0.5) {
            lineMakers.push(
                new LineDrawer (x + markSize, y + markSize, x, y, lineStepPercent)
            );
        } else if (rNum < 0.75) {
            lineMakers.push(
                new LineDrawer (x + markSize, y, x, y + markSize, lineStepPercent)
            );
        } else {
            lineMakers.push(
                new LineDrawer (x, y + markSize, x + markSize, y, lineStepPercent)
            );
        }

        x += markSize;
        if (x > sketch.width) {
            x = 0;
            y += markSize
        }
    }
    
    sketch.windowResized = function() {
        x = 0;
        y = 0;
        lineMakers = [];
        sketch.resizeCanvas(sketch.windowWidth,sketch.windowHeight);
    }

}, document.getElementById('backgroundCanvasHolder'));