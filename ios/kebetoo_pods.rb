def use_kebetoo_pods!()
    # react-native-permissions
    permissions_path = '../node_modules/react-native-permissions/ios'
    pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone.podspec"

    # react-native-google-signin
    pod 'GoogleSignIn', '~> 5.0.2'
end

def react_native_share_menu_post_install(installer)
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'
        end
    end
end