/**
 * 返回值为 promise
 */

/** 链式调用 */
class PromiseD {
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

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      throw new TypeError("type error");
    }
    let isUsed;
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      try {
        let then = x.then;
        if (typeof then === "function") {
          //是一个promise的情况
          then.call(
            x,
            y => {
              if (isUsed) return;
              isUsed = true;
              this.resolvePromise(promise, y, resolve, reject);
            },
            function(e) {
              if (isUsed) return;
              isUsed = true;
              reject(e);
            }
          );
        } else {
          //仅仅是一个函数或者是对象
          resolve(x);
        }
      } catch (e) {
        if (isUsed) return;
        isUsed = true;
        reject(e);
      }
    } else {
      //返回的基本类型，直接resolve
      resolve(x);
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
      nextPromise = new PromiseD((resolve, reject) => {
        this.onFulFilledArr.push(_ => {
          const tmp = onFulfilled(this.value);
          this.resolvePromise(nextPromise, tmp, resolve, reject);
        });
        this.onRejectedArr.push(_ => {
          const tmp = onRejected(this.value);
          this.resolvePromise(nextPromise, tmp, resolve, reject);
        });
      });
    }
    if (this.status === "resolved") {
      nextPromise = new PromiseD((resolve, reject) => {
        try {
          let temp = onFulfilled(this.value);
          this.resolvePromise(nextPromise, tmp, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status === "rejected") {
      nextPromise = new PromiseD((resolve, reject) => {
        try {
          let temp = onRejected(this.value);
          this.resolvePromise(nextPromise, tmp, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    return nextPromise;
  }
}

new PromiseD((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
})
  .then(
    val =>
      new PromiseD(resolve => {
        console.log(val);
        setTimeout(() => {
          resolve(2);
        }, 1000);
      })
  )
  .then(val => {
    console.log(val);
    return 3;
  })
  .then(val => console.log(val))
  .then(
    val =>
      new PromiseD(resolve => {
        setTimeout(() => {
          resolve(4);
        }, 1000);
      })
  )
  .then(val => {
    console.log(val);
  });
