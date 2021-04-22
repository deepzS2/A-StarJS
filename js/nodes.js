export default class Node {
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.isOnPath = false;
        this.isObstacle = false;
    }
}
