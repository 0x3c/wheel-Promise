/**
 * 执行 then 方法, 将then 中的 onFulFilled/onRejected 函数存在相应数组中。
 * 等待构造函数中 执行 resolve/reject 改变 promise 状态, 并执行对应数组中的 onFulFilled/onRejected
 */

/** 链式调用 */
class PromiseC {
  constructor(func) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulFilledArr = [];
    this.onRejectedArr = [];

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.then = this.then.bind(this);
    func(this.resolve, this.reject);
  }
  resolve(value) {
    if (this.status === "pending") {
      this.status = "resolved";
      this.value = value;
      this.onFulFilledArr.forEach(func => func(this.value));
    }
  }
  reject(reason) {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
    }
  }
  then(onFulfilled, onRejected) {
    let nextPromise;
    if (this.status === "pending") {
      this.onFulFilledArr.push(onFulfilled);
      this.onRejectedArr.push(onRejected);
    }
    if (this.status === "resolved") {
      nextPromise = new PromiseC((resolve, reject) => {
        try {
          let temp = onFulfilled(this.value);
          resolve(temp);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status === "rejected") {
      nextPromise = new PromiseC((resolve, reject) => {
        try {
          let temp = onRejected(this.value);
          resolve(temp);
        } catch (error) {
          reject(error);
        }
      });
    }
    return nextPromise;
  }
}

// new PromiseC((resolve, reject) => {
//   console.log("start");
//   setTimeout(() => {
//     resolve(1);
//   }, 1001);
// }).then(val => console.log(val));

new PromiseC((resolve, reject) => {
  console.log("start");
  setTimeout(() => {
    resolve(1);
  }, 1000);
}).then(val => console.log(val));
  .then(val => console.log(val));
