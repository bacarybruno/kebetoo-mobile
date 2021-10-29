class BackgroundTimer {
  constructor() {
    this.intervalId = null;
    jest.setTimeout(10000);
  }

  runBackgroundTimer(handler, timeout) {
    // ensure the function is called at least one time
    handler();
    // call setInterval with the function
    this.intervalId = setInterval(handler, timeout);
  }

  stopBackgroundTimer(intervalId = this.intervalId) {
    clearInterval(intervalId);
  }

  setInterval(handler, timeout) {
    // ensure the function is called at least one time
    handler();
    // call setInterval with the function
    this.intervalId = setInterval(handler, timeout);
  }

  clearInterval(intervalId) {
    this.stopBackgroundTimer(intervalId);
  }
}

module.exports = new BackgroundTimer();
