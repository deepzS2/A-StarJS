export default class Node {
  public positionX: number
  public positionY: number
  public isOnPath: boolean
  public isObstacle: boolean
  public g?: number
  public h?: number
  public f?: number

  constructor(positionX: number, positionY: number) {
    this.positionX = positionX
    this.positionY = positionY
    this.isOnPath = false
    this.isObstacle = false
  }
}
