

class LineDrawer {
    constructor(x, y, destX, destY, stepPercent, initialPercent) {
        this.ox = x;
        this.oy = y;
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.stepPercent = stepPercent;
        this.percent = initialPercent || 0;
    }

    draw(sketch) {
        
        if (this.percent > 0) {
            let effectivePercent = Math.min(1, this.percent);
            let nx = this.ox + effectivePercent * (this.destX - this.ox);
            let ny = this.oy + effectivePercent * (this.destY - this.oy);

            sketch.line(this.ox, this.oy, nx, ny);

            this.x = nx;
            this.y = ny;
        }

        if (this.percent > 1 + this.stepPercent) {
            return;
        }

        this.percent = this.percent + this.stepPercent;
    }

    isComplete() {
        return this.percent > 1;
    }
}

var tenPrint = new p5((sketch) => {

    let lineDrawerGrid = [];
    
    let darkColor = sketch.color(30, 30, 30);
    let lightColor = sketch.color(230, 230, 230);

    let markSize = 70;
    let lineWeight = 2;

    let framesPerSecond = 60;
    let initialEntrySeconds = 2;
    let markDrawDuration = 1;
    let lineStepPercent = 1 / (markDrawDuration * framesPerSecond);

    let lineMakers = [];
    
    let maxSimultaneous = 1000;

    let hasCreatedFirstWave = false;

    let makeLineDrawer = (col, row) => {

        let x = col * markSize;
        let y = row * markSize;

        let initialPercent = hasCreatedFirstWave ? 0 : Math.random() * -initialEntrySeconds;

        let rNum = Math.random();
        if (rNum < 0.25) {
            return new LineDrawer (x, y, x + markSize, y + markSize, lineStepPercent, initialPercent)
        } else if (rNum < 0.5) {
            return new LineDrawer (x + markSize, y + markSize, x, y, lineStepPercent, initialPercent)
        } else if (rNum < 0.75) {
            return new LineDrawer (x + markSize, y, x, y + markSize, lineStepPercent, initialPercent)
        } else {
            return new LineDrawer (x, y + markSize, x + markSize, y, lineStepPercent, initialPercent)
        }
    }

    sketch.updateLineDrawers = () => {
        
        let colCount = Math.ceil(sketch.width / markSize);
        let rowCount = Math.ceil(sketch.height / markSize);

        // Ensure we have the correct number of columns
        for(let newCol = lineDrawerGrid.length; newCol < colCount; newCol ++) {
            // Add a new array of columns
            lineDrawerGrid.push([])
        }
        lineDrawerGrid.splice(colCount)
        
        // For each col, ensure we have the correct number of lineMakers obejcts
        for(let c = 0; c < lineDrawerGrid.length; c++) {
            let col = lineDrawerGrid[c];

            for(let r = col.length; r < rowCount; r++) {

                let lineDrawer = makeLineDrawer(c, r)
                // Add a new line drawer
                col.push(lineDrawer)
            }
        }

        hasCreatedFirstWave = true;
    }

    sketch.setup = function() {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        sketch.background(darkColor);
        sketch.frameRate(framesPerSecond);
        sketch.updateLineDrawers();
    }
    
    sketch.draw = function() {

        sketch.background(darkColor);
        
        sketch.stroke(lightColor);
        sketch.strokeWeight(lineWeight);

        lineDrawerGrid.forEach(col => {
            col.forEach(cell => {
                cell.draw(sketch);
            })
        })
        lineMakers.forEach((m) => {
            m.draw(sketch);
        })
    }
    
    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth,sketch.windowHeight);
        sketch.updateLineDrawers();
    }

}, document.getElementById('backgroundCanvasHolder'));