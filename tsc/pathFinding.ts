import Canvas from "./canvas.js"
import NodeGrid from "./nodes.js"

type ISets = {
  x: number
  y: number
  f: number
  g: number
  h: number
}

export default class PathAlgorithm {
  private readonly canvas: Canvas

  private openSets: ISets[]

  private closedSets: ISets[]

  private cameFrom: ISets[]

  private startPoint = {
    x: 0,
    y: 0,
  }

  private endPoint = {
    x: 10,
    y: 10,
  }

  private obstacles: {
    x: number
    y: number
  }[]

  constructor(canvas: Canvas) {
    this.canvas = canvas
  }

  private heuristic(x: number, y: number) {
    return Math.abs(x - this.endPoint.x) + Math.abs(y - this.endPoint.y)
  }

  public executeAlgorithm() {
    this.openSets = []
    this.closedSets = []
    this.cameFrom = []

    const heuristicStart = this.heuristic(this.startPoint.x, this.startPoint.y)

    const index = this.openSets.push({
      x: this.startPoint.x,
      y: this.startPoint.y,
      f: heuristicStart,
      g: 0,
      h: heuristicStart,
    })

    this.cameFrom.push(this.openSets[index - 1])

    while (this.openSets.length > 0) {
      const current = this.openSets.sort((a, b) => Math.min(a.f, b.f)).shift()

      this.closedSets.push(current)

      if (current.x === this.endPoint.x && current.y === this.endPoint.y) {
        break
      }

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const neighbour = this.canvas.nodeFromPosition(
            current.x + i * this.canvas.NodesDiameter,
            current.y + j * this.canvas.NodesDiameter
          )

          if (!neighbour) continue

          const setNeighbourClosed = this.closedSets.find(
            (value) =>
              value.x === neighbour.positionX && value.y === neighbour.positionY
          )

          if (setNeighbourClosed) continue

          const h = this.heuristic(neighbour.positionX, neighbour.positionY)

          const g = current.g + this.canvas.NodesDiameter
          const f = g + h

          const lastNode = this.cameFrom[this.cameFrom.length - 1]

          if (lastNode.f === 0 || f < lastNode.f) {
            const index = this.openSets.push({
              x: neighbour.positionX,
              y: neighbour.positionY,
              h,
              g,
              f,
            })

            this.cameFrom.push(this.openSets[index - 1])

            continue
          }
        }
      }
    }

    return this.cameFrom
  }

  public setEndPoint(x: number, y: number) {
    const endNode = this.canvas.drawEndPoint(x, y)

    this.endPoint = { x: endNode.positionX, y: endNode.positionY }
  }

  public setStartPoint(x: number, y: number) {
    this.startPoint = { x, y }

    this.canvas.drawStartPoint(this.startPoint.x, this.startPoint.y)
  }

  get EndPoint() {
    return this.endPoint
  }

  get StartPoint() {
    return this.startPoint
  }

  set EndPoint(value) {
    this.endPoint = value
  }

  set StartPoint(value) {
    this.startPoint = value
  }
}
