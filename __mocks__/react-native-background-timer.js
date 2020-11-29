class BackgroundTimer {
  constructor() {
    this.intervalId = null
    jest.setTimeout(10000)
  }

  runBackgroundTimer(handler, timeout) {
    // ensure the function is called at least one time
    handler()
    // call setInterval with the function
    this.intervalId = setInterval(handler, timeout)
  }

  stopBackgroundTimer() {
    clearInterval(this.intervalId)
  }
}

export default new BackgroundTimer()
