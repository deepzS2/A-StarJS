import Canvas from "./canvas.js";
import PathAlgorithm from "./pathFinding.js";
const canvas = new Canvas();
const pathFinding = new PathAlgorithm(canvas);
document.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, executing scripts");
    DrawCanvas(window.innerWidth, window.innerHeight);
});
window.addEventListener("resize", () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    DrawCanvas(viewportWidth, viewportHeight);
});
function DrawCanvas(viewportWidth, viewportHeight) {
    const canvasExist = canvas.tryGetCanvasElement();
    canvas.Context.clearRect(0, 0, viewportWidth, viewportHeight);
    if (!canvas.Canvas && !canvasExist)
        return;
    canvas.resizeCanvas(viewportWidth / 2, viewportHeight / 2);
    console.log(`Canvas resized to: ${canvas.Canvas.width}px x ${canvas.Canvas.height}px`);
    canvas.drawBackground();
    canvas.drawGrid();
    canvas.AStarClass = pathFinding;
    pathFinding.setEndPoint(canvas.Canvas.width, canvas.Canvas.height);
    pathFinding.setStartPoint(0, 0);
    const result = pathFinding.executeAlgorithm();
    console.log(result);
    canvas.drawPath(result);
}
