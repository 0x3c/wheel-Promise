/**
 * 链式调用
 * then 方法返回值用 Promise 包裹, 每次调用都返回 Promise
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
      nextPromise = new PromiseC((resolve, reject) => {
        this.onFulFilledArr.push(_ => {
          const tmp = onFulfilled(this.value);
          resolve(tmp);
        });
        this.onRejectedArr.push(_ => {
          const tmp = onRejected(this.value);
          reject(tmp);
        });
      });
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

new PromiseC((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then(val => {
    console.log(val);
    return 2;
  })
  .then(val => {
    console.log(val);
    return 3;
  })
  .then(val => {
    console.log(val);
  });
