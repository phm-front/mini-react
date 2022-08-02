import {
  HostComponent,
  ClassComponent,
  FunctionComponent,
  HostText,
  Fragment,
} from "./ReactWorkTags";
import { isFn, isStr, isUndefined, Placement } from "./utils";

export function createFiber(vnode, returnFiber) {
  const fiber = {
    // 类型
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    // 不同类型的组件， stateNode也不同
    // 原生标签 dom节点
    // class 实例
    stateNode: null,
    // 第一个子节点
    child: null,
    // 下一个兄弟节点
    sibling: null,
    // 父节点
    return: returnFiber,
    // 行为
    flags: Placement,
    // 索引位置
    index: null,
    // old fiber
    alternate: null,
    // 组件状态 函数组件存的是hook0
    memorizedState: null,
  };
  const { type } = vnode;
  if (isStr(type)) {
    // html元素
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    fiber.tag = type.prototype.isReactComponent ? ClassComponent : FunctionComponent;
  } else if (isUndefined(type)) {
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }
  return fiber;
}
