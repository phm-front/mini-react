import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber } from "./utils";
// 协调
export function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) return
  const newChildren = isArray(children) ? children : [children]
  // console.log(newChildren)
  let preFiber = null
  for (let i = 0; i < newChildren.length; i++) {
    if (newChildren[i] === null) continue
    let newFiber = createFiber(newChildren[i], wip);
    if (preFiber === null) {
      wip.child = newFiber
    } else {
      preFiber.sibling = newFiber
    }
    preFiber = newFiber
  }
  console.log(wip)
}
