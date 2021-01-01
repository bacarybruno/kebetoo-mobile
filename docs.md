# Useful links
- https://github.com/react-native-community/google-signin/blob/master/docs/ios-guide.md
- https://github.com/react-native-community/google-signin/blob/master/docs/android-guide.md
- https://github.com/facebook/react-native-fbsdk
- https://github.com/react-native-community/react-native-audio-toolkit/blob/master/docs/SETUP.md
- https://github.com/react-native-community/react-native-permissions
- https://github.com/zoontek/react-native-bootsplash
- https://github.com/zoontek/react-native-bootsplash/issues/73
- https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Install.md
- https://github.com/ajith-ab/react-native-receive-sharing-intent
- https://firebase.google.com/docs/crashlytics/get-started?platform=android

# Generating SHA1 (google)
- Debug: ```keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android```
- Release: ```keytool -list -v -keystore {keystore_name} -alias {alias_name}```

# Generating hash (fb)
- Debug: ```keytool -exportcert -alias androiddebugkey -keystore ./android/debug.keystore | openssl sha1 -binary | openssl base64```

# Firebase
- https://rnfirebase.io/
- iOS setup: https://rnfirebase.io/messaging/usage/ios-setup
- Headless notification: https://rnfirebase.io/messaging/usage

# Optimize vector-icons to use only desired icons
- Refs: https://github.com/oblador/react-native-vector-icons/blob/master/README.md#android
- Android: (DONE)
- iOS: remove undesired icon from resources and UIAppFonts 
- Or use only a ionic icon package and find a way to use custom icons

# Code coverage
- Will be automatically added by github actions. See `.github/workflows` folder.

# Generate assets
$ `react-native generate-bootsplash --logo-width=200 --background-color=FFFFFF ./splash.png`
$ `react-native set-icon --platform ios --path ./icon.png`

Generate [android icon here](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(255%2C%20255%2C%20255)&crop=0&backgroundShape=none&effects=none&name=ic_launcher)

Generate [notifications icons here](http://romannurik.github.io/AndroidAssetStudio/icons-notification.html#source.type=image&source.space.trim=1&source.space.pad=0&name=ic_stat_ic_notification)