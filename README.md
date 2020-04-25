#Useful links
- https://github.com/react-native-community/google-signin/blob/master/docs/ios-guide.md
- https://github.com/react-native-community/google-signin/blob/master/docs/android-guide.md
- https://github.com/facebook/react-native-fbsdk

#Generating SHA1 (google)
- Debug: keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
- Release: keytool -list -v -keystore {keystore_name} -alias {alias_name}

#Generating hash (fb)
- Debug: keytool -exportcert -alias androiddebugkey -keystore ./android/debug.keystore | openssl sha1 -binary | openssl base64

#Firebase
- https://rnfirebase.io/

#Optimize vector-icons to use only desired icons
- Android: https://github.com/oblador/react-native-vector-icons/blob/master/README.md#android
- iOS: remove undesired icon from resources and UIAppFonts 
- Or use only a ionic icon package and fite a way to use custom icons