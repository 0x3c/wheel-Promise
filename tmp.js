class PromiseA {
  constructor(fn) {
    this.reason = undefined;
    this.value = undefined;
    this.status = "pending";
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.then = this.then.bind(this);

    this.onFulfilledFnArr = [];
    this.onRejectedFnArr = [];

    fn(this.resolve, this.reject);
  }
  resolve(value) {
    if (this.status === "pending") {
      this.status = "resolved";
      this.value = value;
      this.onFulfilledFnArr.forEach(fn => {
        fn(this.value);
      });
    }
  }
  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return new Error();
    }
    if (x === null) {
      resolve(x);
    }
    if (typeof x === "function" || typeof x === "object") {
      //
    }
    resolve(x);
  }
  reject(reason) {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
      this.onRejectedFnArr.forEach(fn => {
        fn(this.reason);
      });
    }
  }
  then(onFulfilled, onRejected) {
    let promise;
    if (this.status === "pending") {
      promise = new PromiseA((resolve, reject) => {
        this.onFulfilledFnArr.push(_ => {
          const tmp = onFulfilled(this.value);
          resolve(tmp);
        });
        this.onRejectedFnArr.push(_ => {
          const tmp = onRejected(this.reason);
          reject(tmp);
        });
      });
    }
    if (this.status === "resolved") {
      const tmp = onFulfilled(this.value);
      promise = new PromiseA((resolve, reject) => {
        resolve(tmp);
      });
    }
    if (this.status === "rejected") {
      const tmp = onRejected(this.reason);
      promise = new PromiseA((resolve, reject) => {
        resolve(tmp);
      });
    }
    return promise;
  }
}

// new PromiseA((resolve, reject) => {

// }).then(data => console.log(data));

new PromiseA((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
})
  .then(data => {
    console.log(data);
    return 1;
  })
  .then(
    data =>
      new PromiseA(resolve => {
        setTimeout(() => {
          resolve(2);
        }, 1000);
      })
  )
  .then(data => {
    console.log(data);
    return 3;
  })
  .then(data => {
    console.log(data);
    return 4;
  });
