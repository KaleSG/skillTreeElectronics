import { Vector } from '@ts/util/Vector.ts'

const viewportGrid = document.getElementById('viewport') as HTMLElement

const gridSpacing = parseInt(window.getComputedStyle(viewportGrid).getPropertyValue('--grid_spacing'))

export function updateGridPosition(position: Vector) {
  let wrapped_position = Vector.mod(position, gridSpacing)

  viewportGrid?.style.setProperty('--x', `${wrapped_position.x}px`)
  viewportGrid?.style.setProperty('--y', `${wrapped_position.y}px`)
}
