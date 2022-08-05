import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, Update } from "./utils";
// 协调
export function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) return
  const newChildren = isArray(children) ? children : [children]
  let previousNewFiber = null
  // oldfiber的头结点
  let oldFiber = wip.alternate?.child
  for (let i = 0; i < newChildren.length; i++) {
    if (newChildren[i] === null) continue
    let newFiber = createFiber(newChildren[i], wip);
    const same = sameNode(newFiber, oldFiber)
    if (same) {
      // 同一个节点 复用
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      });
    }
    if (!same && oldFiber) {
      // 删除老节点
      deleteChild(wip, oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (previousNewFiber === null) {
      wip.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
}

function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions;
  if (deletions) {
    returnFiber.deletions.push(childToDelete);
  } else {
    returnFiber.deletions = [childToDelete];
  }
}

// 节点复用的条件：1. 同一层级下 2. 类型相同 3. key相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
