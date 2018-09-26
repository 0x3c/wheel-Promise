/**
 * 1. promise 是一个对象/函数, 该对象/函数有一个 then 方法
 * 2. thenable 是一个对象/函数, 用来定义 then 方法
 * 3. value 是 promise 成功时的值
 * 4. reason 时 promise 失败时的值
 */

/**
 * promise 有三个状态, pending, fulfilled, rejected.
 * promise 必须有一个 then 方法, then 方法接受两个参数  promise.then(onFulfilled,onRejected)
 * then 方法必须返回一个 promise
 */

/** 无法处理异步函数 */
/** 函数 */
function PromiseA(constructor) {
  this.status = "pending";
  this.value = undefined;
  this.reason = undefined;
  const resolve = value => {
    if (this.status === "pending") {
      this.value = value;
      this.status = "resolved";
    }
  };
  const reject = reason => {
    if (this.status === "pending") {
      this.reason = reason;
      this.tatus = "rejected";
    }
  };
  try {
    constructor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

PromiseA.prototype.then = function(resolve, reject) {
  if (this.status === "resolved") {
    resolve(this.value);
  } else if (this.status === "rejected") {
    reject(this.reason);
  } else {
    console.log("pending");
  }
};

new PromiseA((resolve, reject) => {
  console.log("start");
  resolve(1);
}).then(val => console.log(val));

/** 对象 */
class PromiseObj {
  constructor(func) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.then = this.then.bind(this);
    func(this.resolve, this.reject);
  }
  resolve(value) {
    if (this.status === "pending") {
      this.status = "resolved";
      this.value = value;
    }
  }
  reject(reason) {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === "resolved") {
      onFulfilled(this.value);
    }
    if (this.status === "rejected") {
      onRejected(this.reason);
    }
    console.log(this.value);
  }
}

new PromiseObj((resolve, reject) => {
  console.log("start");
  setTimeout(() => {
    resolve(2);
  }, 100);
}).then(val => console.log(val));
