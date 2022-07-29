import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";

import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from "./ReactFiberReconciler";
import { Placement } from "./utils";

let wip = null; // work in progress 当前正在工作中的fiber
let wipRoot = null;
// 初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber
}

export function performUnitOfWork() {
  const { tag } = wip;
  // todo1 更新当前组件
  switch (tag) { 
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }
  // todo 2. 下一个更新谁 深度优先遍历 （国王的故事）
  if (wip.child) {
    wip = wip.child
    return
  }
  let next = wip;

  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }

  wip = null;
}

function workLoop() {
  while(wip) {
    performUnitOfWork()
  }

  if (!wip && wipRoot) {
    // 渲染
    commitRoot();
  }
}

function commitRoot() {
  // 提交worker
  commitWorker(wipRoot);
  // 执行完置空 防止重复执行
  wipRoot = null
}

function commitWorker(wip) {
  if (!wip) return
  // 提交自己
  const parentNode = wip.return.stateNode
  // console.log(parentNode)
  const { flags, stateNode } = wip
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  // 提交子节点
  commitWorker(wip.child)
  // 提交兄弟节点
  commitWorker(wip.sibling)
}

requestIdleCallback(workLoop)
