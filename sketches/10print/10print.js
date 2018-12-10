

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
    
    let fadeAlpha = 20;
    let darkColor = sketch.color(37, 148, 185);
    let lightColor = sketch.color(153, 204, 255);

    let markSize = 70;
    let lineWeight = 2;

    let framesPerSecond = 60;
    let initialEntrySeconds = 2;
    let markDrawDuration = 1;
    let lineStepPercent = 1 / (markDrawDuration * framesPerSecond);
    
    let regenProbability = 1.0 / 10 / framesPerSecond;

    let hasCreatedFirstWave = false;

    let makeLineDrawer = (col, row, isSlower) => {

        let x = col * markSize;
        let y = row * markSize;

        let initialPercent = hasCreatedFirstWave ? 0 : Math.random() * -initialEntrySeconds;
        let effectiveLineStepDuration = isSlower ? lineStepPercent / 3 :lineStepPercent;

        let rNum = Math.random();
        if (rNum < 0.25) {
            return new LineDrawer (x, y, x + markSize, y + markSize, effectiveLineStepDuration, initialPercent)
        } else if (rNum < 0.5) {
            return new LineDrawer (x + markSize, y + markSize, x, y, effectiveLineStepDuration, initialPercent)
        } else if (rNum < 0.75) {
            return new LineDrawer (x + markSize, y, x, y + markSize, effectiveLineStepDuration, initialPercent)
        } else {
            return new LineDrawer (x, y + markSize, x + markSize, y, effectiveLineStepDuration, initialPercent)
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

        sketch.noStroke();
        sketch.fill(sketch.red(darkColor), sketch.green(darkColor), sketch.blue(darkColor), fadeAlpha);
        sketch.rect(0, 0, sketch.width, sketch.height);

        sketch.stroke(lightColor);
        sketch.strokeWeight(lineWeight);

        for(let c = 0; c < lineDrawerGrid.length; c++) {
            for (let r = 0; r < lineDrawerGrid[c].length; r++) {
                lineDrawerGrid[c][r].draw(sketch);

                if (Math.random() < regenProbability) {
                    lineDrawerGrid[c][r] = makeLineDrawer(c, r, true);
                }
            }
        }
        lineDrawerGrid.forEach(col => {
            col.forEach(cell => {
                cell.draw(sketch);
                
            })
        })
    }
    
    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth,sketch.windowHeight);
        sketch.background(darkColor);
        sketch.updateLineDrawers();
    }

}, document.getElementById('backgroundCanvasHolder'));