import { createFiber } from "./ReactFiber"
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"

class ReactDOMRoot {
  constructor(internalRoot) {
    this._internalRoot = internalRoot
  }
  render(children) {
    const root = this._internalRoot
    updateContainer(children, root)
  }
}

function updateContainer(element, container) {
  const { containerInfo } = container
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo
  })
  // 初次渲染
  scheduleUpdateOnFiber(fiber)
}

function createRoot(container) {
  const root = { containerInfo: container }
  return new ReactDOMRoot(root)
}

export default { createRoot }
