// 更新普通标签
export function updateHostComponent(fiber) {
  if (!fiber.stateNode) {
    fiber.stateNode = document.createElement(fiber.type)
  }
}
export function updateFunctionComponent() {}
export function updateClassComponent() {}
export function updateFragmentComponent() {}
export function updateHostTextComponent() {}
