import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

// 当前正在渲染的fiber
let currentlyRenderingFiber = null;
// 当前正在工作的hook
let workInProgressHook = null;

function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null;
  workInProgressHook = null;
}
// 获取当前hook
function updateWorkInProgressHook() {
  let hook
  // 老节点 fiber
  const current = currentlyRenderingFiber.alternate
  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState
    if (workInProgressHook) {
      // 后续hook
      hook = workInProgressHook.next
      workInProgressHook = hook
    } else {
      // 第一个hook
      hook = currentlyRenderingFiber.memorizedState
      workInProgressHook = hook
    }
  } else {
    // 组件初次渲染
    hook = {
      memorizedState: null,
      next: null
    }
    if (workInProgressHook) {
      // 后续hook
      workInProgressHook.next = hook
      workInProgressHook = hook
    } else {
      // 第一个hook
      currentlyRenderingFiber.memorizedState = hook
      workInProgressHook = hook
    }
  }
  return hook
}
function useReducer(reducer, initialArg) {
  // 获取当前hook
  const hook = updateWorkInProgressHook()
  if (!currentlyRenderingFiber.alternate) {
    // 不存在old fiber 初次渲染
    hook.memorizedState = initialArg
  }
  const dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    hook,
    reducer
  )
  return [hook.memorizedState, dispatch]
}

function dispatchReducerAction(fiber, hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState, action) : action;
  fiber.alternate = { ...fiber };
  fiber.sibling = null;
  scheduleUpdateOnFiber(fiber);
}

function useState(initalState) {
  return useReducer(null, initalState);
}

export {
  useReducer,
  useState,
  renderWithHooks
}
