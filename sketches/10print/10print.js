
class LineDrawer {
    constructor(x, y, destX, destY, stepPercent, initialPercent, color, rainbowColor) {
        this.ox = x;
        this.oy = y;
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.stepPercent = stepPercent;
        this.percent = initialPercent || 0;
        this.color = color;
        this.rainbowColor = rainbowColor;
    }

    draw(sketch) {
        let size = Math.abs(this.destX - this.ox);
        const mouseSensivityRadius = size * 5;

        let mx = (this.ox + this.destX) / 2, my = (this.oy + this.destY) / 2;
        let distToMouse = sketch.dist(sketch.mouseX, sketch.mouseY, mx, my);
        
        let percentClose = (mouseSensivityRadius - distToMouse) / mouseSensivityRadius;

        if (percentClose > 0) {
            let resultColor = sketch.lerpColor(this.color, this.rainbowColor, percentClose);
            sketch.stroke(resultColor);
        } else {
            sketch.stroke(this.color);
        }
        
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
    
    sketch.colorMode(sketch.HSB, 255, 255, 255, 100);

    let lineDrawerGrid = [];
    
    let fadeAlpha = 20;
    
    let backgroundColor = sketch.color(100, 0, 60, 10);
    let foregroundColor = sketch.color(160, 0, 100, 20);

    let markSize = 50;
    let lineWeight = 1.5;

    let framesPerSecond = 18;
    let initialEntrySeconds = 3;
    let markDrawDuration = 1;
    let lineStepPercent = 1 / (markDrawDuration * framesPerSecond);
    
    let regenProbability = 1.0 / 10 / framesPerSecond;

    let hasCreatedFirstWave = false;
    
    let hueIncrement = 5;
    let lineBrightness = 200;
    let lineSaturation = 225;


    let hue = Math.random() * 255;

    let makeLineDrawer = (col, row, isSlower) => {

        hue += hueIncrement;
        hue %= 255;

        let color = foregroundColor; //sketch.color(hue, lineBrightness, lineSaturation);


        let x = col * markSize;
        let y = row * markSize;

        let initialPercent = hasCreatedFirstWave ? 0 : Math.random() * -initialEntrySeconds;
        let effectiveLineStepDuration = isSlower ? lineStepPercent / 3 :lineStepPercent;
        
        let rainbowColor = sketch.color(hue, 160, 160, 75);

        let rNum = Math.random();
        if (rNum < 0.25) {
            return new LineDrawer (x, y, x + markSize, y + markSize, effectiveLineStepDuration, initialPercent, color, rainbowColor)
        } else if (rNum < 0.5) {
            return new LineDrawer (x + markSize, y + markSize, x, y, effectiveLineStepDuration, initialPercent, color, rainbowColor)
        } else if (rNum < 0.75) {
            return new LineDrawer (x + markSize, y, x, y + markSize, effectiveLineStepDuration, initialPercent, color, rainbowColor)
        } else {
            return new LineDrawer (x, y + markSize, x + markSize, y, effectiveLineStepDuration, initialPercent, color, rainbowColor)
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
        sketch.frameRate(framesPerSecond);
        sketch.windowResized();
    }
    
    sketch.draw = function() {

        sketch.noStroke();
        sketch.fill(backgroundColor);
        sketch.rect(0, 0, sketch.width, sketch.height);

        sketch.stroke(foregroundColor);
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
        sketch.background(sketch.hue(backgroundColor), sketch.saturation(backgroundColor), sketch.brightness(backgroundColor));
        sketch.updateLineDrawers();
    }

}, document.getElementById('backgroundCanvasHolder'));