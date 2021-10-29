import { DeviceEventEmitter, NativeAppEventEmitter, Platform } from 'react-native';
import RNBackgroundTimer from 'react-native-background-timer';

const EventEmitter = Platform.select({
  ios: NativeAppEventEmitter,
  android: DeviceEventEmitter,
});

class BackgroundTimer {
  static setInterval(callback, delay) {
    RNBackgroundTimer.start();
    this.backgroundListener = EventEmitter.addListener('backgroundTimer', () => {
      this.backgroundTimer = RNBackgroundTimer.setInterval(callback, delay);
    });
    return this.backgroundListener;
  }

  static clearInterval(timer) {
    if (timer) timer.remove();
    if (this.backgroundTimer) RNBackgroundTimer.clearInterval(this.backgroundTimer);
    RNBackgroundTimer.stop();
  }
}

export default BackgroundTimer;
