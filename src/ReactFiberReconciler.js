import { reconcileChildren } from "./ReactChildFiber"
import { updateNode } from "./utils"

// 更新原生标签
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    // 处理属性
    updateNode(wip.stateNode, {}, wip.props)
  }
  // 处理children
  reconcileChildren(wip, wip.props.children)
}
export function updateFunctionComponent() {}
export function updateClassComponent() {}
export function updateFragmentComponent() {}
export function updateHostTextComponent() {}
