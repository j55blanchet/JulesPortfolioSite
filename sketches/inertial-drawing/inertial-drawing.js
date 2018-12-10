

var inertialDrawing = new p5((sketch) => {

    sketch.setup = function() {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        
    }

    let lines = [];

    let hueStep = 45;
    let friction = 0.07;
    let velocityMultiplier = 0.5;

    let prevMouseX = -1, prevMouseY = -1;
    
    let drawLine = function(lineObj) {
        
        let alpha = 255;
        if (lineObj.life < 255) {alpha = lineObj.life;}
        
        let startHue = lineObj.startHue;
        sketch.colorMode(sketch.HSB);
        sketch.stroke(startHue, 205, 205, alpha);
        sketch.strokeWeight(5);
        
        for(let i = 1; i < lineObj.coords.length; i++) {
            let pp = lineObj.coords[i-1];
            let p = lineObj.coords[i];
            
            sketch.line(p.x, p.y, pp.x, pp.y);
        }
        
        for(let i = 0; i < lineObj.coords.length; i++) {
            sketch.fill(0, 0, 30);
            let p = lineObj.coords[i];
            sketch.strokeWeight(2);
            sketch.ellipse(p.x, p.y, 10, 10);
        }
    };
    
    let stepLine = function(lineObj) {
        
        let fracLeft = 1 - friction;
        for(let i = 0; i < lineObj.coords.length; i++) {
            let p = lineObj.coords[i];
            let v = lineObj.velocities[i];
            lineObj.coords[i] = sketch.createVector(p.x + v.x, p.y + v.y);
            
            lineObj.velocities[i] = sketch.createVector(v.x * fracLeft, v.y * fracLeft);
        }
        
        lineObj.life = lineObj.life - 1;
    };
    
    let removeDeadLines = function(lineList) {
        for(let i = lineList.length - 1; i >= 0; i--) {
            if (lineList[i].life <= 0) {
                lineList.splice(i, 1);   
            }
        }
    };
    
    sketch.draw = function() {
        sketch.colorMode(sketch.RGB);
        sketch.background(81);
        
        for(let i = 0; i < lines.length; i++) {
            drawLine(lines[i]);
            stepLine(lines[i]);
            removeDeadLines(lines);
        }
        
        prevMouseX = sketch.mouseX;
        prevMouseY = sketch.mouseY;
    };
    
    
    
    let lastHue = 0;
    
    sketch.mousePressed = function() {
        let thisHue = (lastHue + hueStep) % 255;
        lines.push({
            startHue: thisHue,
            coords: [],
            velocities: [],
            life: 400
        });
        
        lastHue = thisHue;
        
    };
    
    sketch.mouseDragged = function() {
        let thisLine = lines[lines.length - 1];
        if (!thisLine) { sketch.mousePressed(); }
        
        thisLine.life = 400;
        let index = thisLine.coords.length - 1;
        let pPoint = thisLine.coords[index - 1];
        let thisPoint = sketch.createVector(sketch.mouseX, sketch.mouseY);
        
        if (index >= 2 && sketch.dist(pPoint.x, pPoint.y, thisPoint.x, thisPoint.y) < 5) {
            // Don't add a point unless we've dragged at least some distance
            // since the last point
            return;        
        }
        
        thisLine.coords.push(thisPoint);
        let velocity = sketch.createVector((sketch.mouseX - prevMouseX) * velocityMultiplier, 
                                    (sketch.mouseY - prevMouseY) * velocityMultiplier);
        thisLine.velocities.push(velocity);
    };
    
    sketch.windowResized = function() {
        sketch.resizeCanvas(sketch.windowWidth,sketch.windowHeight);
    }

}, document.getElementById('backgroundCanvasHolder'));