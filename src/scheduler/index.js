// 消息通道 宏任务
const channel = new MessageChannel()
const { port1, port2 } = channel
import { peek, pop, push } from "./minHeap"
// 最小堆 任务队列
let taskQueue = []
let taskIdCounter = 1

export function scheduleCallback(callback) {
  const currentTime = getCurrentTime()
  // 等待时间 -1立即执行
  const timeout = -1
  // 过期时间
  const expirtationTime = currentTime - timeout
  const newTask = {
    id: taskIdCounter++,
    callback,
    expirtationTime,
    sortIndex: expirtationTime
  }
  // 任务加到任务队列
  push(taskQueue, newTask)
  // 请求调度
  requestHostCallback()
}

function requestHostCallback() {
  port2.postMessage(null);
}

port1.onmessage = function() {
  workLoop()
}
// 执行任务
function workLoop() {
  let currentTask = peek(taskQueue)
  while(currentTask) {
    const callback = currentTask.callback
    currentTask.callback = null
    callback()
    pop(taskQueue)
    currentTask = peek(taskQueue)
  }
}

function getCurrentTime() {
  return performance.now()
}
