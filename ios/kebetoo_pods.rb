def use_kebetoo_pods!()
    pod 'GoogleSignIn', '~> 5.0.2'
    pod 'Permission-Microphone', :path => '../node_modules/react-native-permissions/ios/Microphone'
    pod 'RNConvertPhAsset', :path => '../node_modules/react-native-convert-ph-asset'
    pod 'react-native-ffmpeg/full-lts', :podspec => '../node_modules/react-native-ffmpeg/react-native-ffmpeg.podspec'
end

def react_native_share_menu_post_install(installer)
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'
        end
    end
    # ref https://medium.com/@khushwanttanwar/xcode-12-compilation-errors-while-running-with-ios-14-simulators-5731c91326e9
    installer.pods_project.build_configurations.each do |config|
        config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
    end
end

# Post Install processing for Flipper
def flipper_post_install(installer)
  installer.pods_project.targets.each do |target|
    if target.name == 'YogaKit'
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '4.1'
      end
    end
  end
end

# Post Install to enforce IPHONEOS_DEPLOYMENT_TARGET
def iphoneos_post_install(installer)
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
     config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '9.0'
    end
  end
end
