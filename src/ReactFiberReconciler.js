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
// 函数组件
export function updateFunctionComponent(wip) {
  const children = wip.type(wip.props)
  reconcileChildren(wip, children)
}
// 类组件
export function updateClassComponent(wip) {
  const instance = new wip.type(wip.props)
  const children = instance.render()
  // console.log(children)
  reconcileChildren(wip, children)
}
export function updateFragmentComponent(wip) {
  // 处理children
  reconcileChildren(wip, wip.props.children)
}
// 文本节点
export function updateHostTextComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createTextNode(wip.props.children)
  }
}
