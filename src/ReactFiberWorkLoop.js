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
import { Placement, Update, updateNode } from "./utils";
import { scheduleCallback } from "./scheduler";

let wip = null; // work in progress 当前正在工作中的fiber
let wipRoot = null;
// 初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber
  scheduleCallback(workLoop)
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
  const parentNode = getParentNode(wip.return)
  const { flags, stateNode } = wip
  // 新增、插入、移动
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  // 更新
  if (flags & Update && stateNode) {
    // 更新属性
    updateNode(stateNode, wip.alternate.props, wip.props)
  }
  // 提交子节点
  commitWorker(wip.child)
  // 提交兄弟节点
  commitWorker(wip.sibling)
}

// 获取父dom节点
function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}

// requestIdleCallback(workLoop)
