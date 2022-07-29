import { reconcileChildren } from "./ReactChildFiber"

// 更新普通标签
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
  }
  // 处理children
  reconcileChildren(wip, wip.props.children)
}
export function updateFunctionComponent() {}
export function updateClassComponent() {}
export function updateFragmentComponent() {}
export function updateHostTextComponent() {}
