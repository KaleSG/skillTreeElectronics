// CanvasViewport.js

import { Vector } from '../../util/Vector.ts'
import './grid-handler.ts'
import { updateGridPosition } from './grid-handler.ts'

const viewport = document.getElementById('viewport') as HTMLElement
const canvas = document.getElementById('viewport-canvas') as HTMLElement

/* Canvas States*/
let pos: Vector = new Vector(0, 0) // (pixels / ms^2)

/* Pointer States */
let isDragging: boolean = false
let lastPointerDownPosition: Vector // Absolute mouse position as of the previous pointer move event during pointer down
let lastPointerDownTime: number;

/* State Differentials */
let lastDeltaTime: number;
let lastDeltaPos: number;

// Single-Pointer Drag Handling
viewport?.addEventListener('pointerdown',registerDragStart);
viewport?.addEventListener('pointermove',updateDraggingPosition);
viewport?.addEventListener('pointerup',registerDragEnd);

/* Global Helpers */

// Updates canvas background grid positioning given a vector position.
function updateCanvasPosition(position: Vector) {
  canvas?.style.setProperty('--x', `${position.x}px`)
  canvas?.style.setProperty('--y', `${position.y}px`)
  updateGridPosition(position);
}

/* Single-Finger-Drag EventHandling */

function registerDragStart(e: MouseEvent) {
  isDragging = true
  lastPointerDownPosition = new Vector(e.clientX, e.clientY);
  lastPointerDownTime = performance.now();
}

function updateDraggingPosition(e: MouseEvent) {
if (isDragging) {
   let absolutePointerPosition = new Vector(e.clientX, e.clientY)
    let deltaPos = Vector.sub(absolutePointerPosition, lastPointerDownPosition)
    lastPointerDownPosition = absolutePointerPosition

    Vector.addTo(pos, deltaPos)
    updateCanvasPosition(pos)
}
}

function registerDragEnd() {
  isDragging = false
}
