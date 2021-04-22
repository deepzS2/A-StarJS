import NodeGrid from "./nodes.js";
export default class Canvas {
    constructor() {
        this.nodesRadius = 20;
        this.grid = new Array();
        this.isDragging = false;
        this.points = new Array();
        this.mousePosition = { x: 0, y: 0 };
        this.htmlTexts = [
            "G (cost between start and <i>n</i>): ",
            "H (heuristic function estimating the cost of <br /> the cheapest path from n to goal): ",
            "F (G + H): ",
        ];
        this.canvas =
            document.getElementById("canvas") || null;
        this.width = this.canvas.width || 0;
        this.height = this.canvas.height || 0;
        this.context = this.canvas.getContext("2d") || null;
        if (this.canvas) {
            this.canvas.addEventListener("mousedown", this.onDragObject.bind(this));
            this.canvas.addEventListener("mousemove", this.onMoveMouse.bind(this));
            this.canvas.addEventListener("mouseup", this.onStopDragObject.bind(this));
        }
    }
    get Canvas() {
        return this.canvas;
    }
    get Context() {
        return this.context;
    }
    get Grid() {
        return this.grid;
    }
    get NodesDiameter() {
        return this.nodesRadius * 2 - 0.1;
    }
    set AStarClass(value) {
        this.aStarClass = value;
    }
    tryGetCanvasElement() {
        this.canvas =
            document.getElementById("canvas") || null;
        if (!this.canvas)
            return false;
        this.context = this.canvas.getContext("2d") || null;
        return true;
    }
    update() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.drawGrid();
        this.points.forEach((value) => {
            this.context.fillStyle = value.fill;
            this.context.fillRect(value.x, value.y, this.nodesRadius * 2 - 0.1, this.nodesRadius * 2 - 0.1);
        });
    }
    resizeCanvas(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    drawBackground() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "#170C07";
        this.context.fillRect(0, 0, this.width, this.height);
    }
    nodeFromPosition(x, y) {
        let position = [0, 0];
        if (x > 0)
            position[0] = Math.round(x / (this.nodesRadius * 2) - 0.45);
        if (y > 0)
            position[1] = Math.round(y / (this.nodesRadius * 2) - 0.45);
        if (x === this.width)
            position[0] -= this.nodesRadius * 2;
        if (y === this.height)
            position[1] -= this.nodesRadius * 2;
        if (position[0] < 0 ||
            position[0] > this.grid.length - 1 ||
            position[1] < 0 ||
            position[1] > this.grid[0].length) {
            return;
        }
        return this.grid[position[0]][position[1]];
    }
    drawGrid() {
        this.grid = new Array();
        const nodesDiameter = this.nodesRadius * 2;
        for (let x = 0; x <= Math.floor(this.width / nodesDiameter); x++) {
            this.grid.push([]);
            for (let y = 0; y <= Math.floor(this.height / nodesDiameter); y++) {
                const positionX = x * nodesDiameter; // + this.nodesRadius
                const positionY = y * nodesDiameter; // + this.nodesRadius
                this.grid[x].push(new NodeGrid(positionX, positionY));
            }
        }
        for (const nodes of this.grid) {
            for (const node of nodes) {
                // this.context.beginPath()
                this.context.fillStyle = "hsl(90, 9%, 86%)";
                this.context.fillRect(node.positionX, node.positionY, nodesDiameter - 0.1, nodesDiameter - 0.1);
                this.context.stroke();
                // this.context.closePath()
            }
        }
    }
    onDragObject(event) {
        event.preventDefault();
        event.stopPropagation();
        // Mouse position
        const mx = event.clientX - this.canvas.getBoundingClientRect().left;
        const my = event.clientY - this.canvas.getBoundingClientRect().top;
        if (event.button === 2) {
            const node = this.nodeFromPosition(mx, my);
            if (node.isOnPath) {
                const gCostParagraph = document.getElementById("g");
                const fCostParagraph = document.getElementById("f");
                const hCostParagraph = document.getElementById("h");
                gCostParagraph.innerHTML = `${this.htmlTexts[0]} <b>${node.g.toFixed(2)}</b>`;
                hCostParagraph.innerHTML = `${this.htmlTexts[1]} <b>${node.h}</b>`;
                fCostParagraph.innerHTML = `${this.htmlTexts[2]} <b>${node.f.toFixed(2)}</b>`;
            }
        }
        if (event.button === 0) {
            this.isDragging = true;
            this.points.forEach((value, i, thisArray) => {
                const insideDiameter = (position) => value[position] + (this.nodesRadius * 2 - 0.1);
                if (mx > value.x &&
                    mx < insideDiameter("x") &&
                    my > value.y &&
                    my < insideDiameter("y")) {
                    this.isDragging = true;
                    thisArray[i].isDragging = true;
                }
            });
            this.mousePosition = { x: mx, y: my };
        }
    }
    onStopDragObject(event) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
        this.points.forEach((value, i, thisArray) => {
            if (thisArray[i].isDragging) {
                const node = this.nodeFromPosition(value.x, value.y);
                thisArray[i].x = node.positionX;
                thisArray[i].y = node.positionY;
            }
            thisArray[i].isDragging = false;
        });
        this.update();
        const newStart = this.points.find((value) => value.name === "startPoint");
        const newEnd = this.points.find((value) => value.name === "endPoint");
        this.aStarClass.StartPoint = newStart;
        this.aStarClass.EndPoint = newEnd;
        const path = this.aStarClass.executeAlgorithm();
        this.drawPath(path);
    }
    onMoveMouse(event) {
        if (this.isDragging) {
            event.preventDefault();
            event.stopPropagation();
            const mx = event.clientX - this.canvas.getBoundingClientRect().left;
            const my = event.clientY - this.canvas.getBoundingClientRect().top;
            const dx = mx - this.mousePosition.x;
            const dy = my - this.mousePosition.y;
            this.points.forEach((value, i, thisArray) => {
                if (value.isDragging) {
                    thisArray[i].x += dx;
                    thisArray[i].y += dy;
                }
            });
            this.update();
            this.mousePosition.x = mx;
            this.mousePosition.y = my;
        }
    }
    drawPath(path) {
        path.forEach((value) => {
            if (this.points.find((point) => point.x === value.x && point.y === value.y)) {
                return;
            }
            const node = this.nodeFromPosition(value.x, value.y);
            for (let i = 0; i < this.grid.length - 1; i++) {
                const j = this.grid[i].findIndex((value) => value.positionX === node.positionX &&
                    value.positionY === node.positionY);
                if (j !== -1 && node.positionX === 920)
                    console.log(node);
                if (j !== -1) {
                    Object.assign(this.grid[i][j], {
                        g: value.g,
                        isOnPath: true,
                        h: value.h,
                        f: value.f,
                    });
                }
            }
            this.context.fillStyle = "#5A00F5";
            this.context.fillRect(value.x, value.y, this.nodesRadius * 2 - 0.1, this.nodesRadius * 2 - 0.1);
        });
    }
    drawStartPoint(x, y) {
        const node = this.nodeFromPosition(x, y);
        this.context.fillStyle = "#B0C4B1";
        this.context.fillRect(node.positionX, node.positionY, this.nodesRadius * 2 - 0.1, this.nodesRadius * 2 - 0.1);
        this.points.push({
            x: node.positionX,
            y: node.positionY,
            isDragging: false,
            name: "startPoint",
            fill: "#B0C4B1",
        });
    }
    drawEndPoint(x, y) {
        const node = this.nodeFromPosition(x === this.width ? x - this.nodesRadius * 2 : x, y === this.height ? y - this.nodesRadius * 2 : y);
        this.context.fillStyle = "#741A28";
        this.context.fillRect(node.positionX, node.positionY, this.nodesRadius * 2 - 0.1, this.nodesRadius * 2 - 0.1);
        this.points.push({
            x: node.positionX,
            y: node.positionY,
            isDragging: false,
            name: "endPoint",
            fill: "#741A28",
        });
        return node;
    }
    canvasPositionToArrayIndex(x, y) {
        return [
            x === 0 ? 0 : Math.floor(x / (this.nodesRadius * 2) - 0.1),
            y === 0 ? 0 : Math.floor(y / (this.nodesRadius * 2) - 0.1),
        ];
    }
}
