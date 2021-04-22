# A\* search algorithm 🤖

**A\* (A-star)**, according to **[Wikipedia 🌐](https://en.wikipedia.org/wiki/A*_search_algorithm)**, is a _path search algorithm_, used in many fields of computer science.

## Description about A\*

On this algorithm we search the best path to an specific target.

The mathematic equation to this algorithm is:
`f(n) = g(n) + h(n)`

Where `n` is the next `node` on the path, `g(n)` is the cost of the path from the start node to `n`, and `h(n)` is a heuristic function that estimates the cost of the cheapest path from `n` to the target.

On the Wikipedia article provided they have the pseudocode to test it so you can try it yourself too 😃!

## Goals

On this project, the goal is to make the pathfinding algorithm works on a canvas with a drag and drop to mess with the algorithm.
Providing a drag and drop of the target, the start node and obstacles.

## Test it now!

Trough this [link](https://deepzs2.github.io/A-StarJS/) you can see a preview of the algorithm working!
