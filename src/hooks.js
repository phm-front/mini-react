import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { areHookInputsEqual, HookLayout, HookPassive } from "./utils";

// 当前正在渲染的fiber
let currentlyRenderingFiber = null;
// 当前正在工作的hook
let workInProgressHook = null;

// 老hook
let currentHook = null;

function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null;
  workInProgressHook = null;
  // 为了方便，useEffect与useLayoutEffect区分开，并且以数组管理
  // 源码中是放一起的，并且是个链表
  currentlyRenderingFiber.updateQueueOfEffect = [];
  currentlyRenderingFiber.updateQueueOfLayout = [];
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
      currentHook = currentHook.next;
    } else {
      // 第一个hook
      hook = currentlyRenderingFiber.memorizedState
      workInProgressHook = hook
      currentHook = current.memorizedState;
    }
  } else {
    // 组件初次渲染
    currentHook = null
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

function updateEffectImp(hooksFlags, create, deps) {
  const hook = updateWorkInProgressHook()
  // 比较deps
  if (currentHook) {
    const prevEffect = currentHook.memorizedState;
    if (deps) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(deps, prevDeps)) {
        return;
      }
    }
  }
  const effect = { hooksFlags, create, deps }
  hook.memorizedState = effect
  if (hooksFlags & HookPassive) {
    currentlyRenderingFiber.updateQueueOfEffect.push(effect)
  } else if(hooksFlags & HookLayout) {
    currentlyRenderingFiber.updateQueueOfLayout.push(effect)
  }
}

function useEffect(create, deps) {
  updateEffectImp(HookPassive, create, deps)
}

function useLayoutEffect(create, deps) {
  updateEffectImp(HookLayout, create, deps)
}

export {
  useReducer,
  useState,
  renderWithHooks,
  useEffect,
  useLayoutEffect
}
