def use_kebetoo_pods!()
    # react-native-permissions
    permissions_path = '../node_modules/react-native-permissions/ios'
    pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone"

    # react-native-google-signin
    pod 'GoogleSignIn', '~> 5.0.2'

    pod 'RNConvertPhAsset', :path => '../node_modules/react-native-convert-ph-asset'
end

def react_native_share_menu_post_install(installer)
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'
        end
    end
    # ref https://medium.com/@khushwanttanwar/xcode-12-compilation-errors-while-running-with-ios-14-simulators-5731c91326e9
    installer.pods_project.build_configurations.each do |config|
        config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
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
