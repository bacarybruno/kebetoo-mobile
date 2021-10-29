import { useRef } from 'react';
import { Linking, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  Typography, TextInput, PasswordInput, Logo, FullButton,
} from '@app/shared/components';
import SocialSignIn from '@app/features/account/components/social-signin';
import { env, strings } from '@app/config';
import { metrics } from '@app/theme';
import { useAppStyles } from '@app/shared/hooks';

import createThemedStyles from './styles';
import useSignUp from './hook';

export const fieldNames = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
};

const createKeyword = ({ word, link }) => (
  <Typography
    text={word}
    type={Typography.types.headline5}
    color={Typography.colors.link}
    onPress={() => Linking.openURL(link)}
  />
);

const withKeyword = (string, ...keywords) => (
  strings.formatString(string, ...keywords.map(createKeyword))
);

const SignUp = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signup });

  const fullNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const {
    errors,
    focusEmail,
    focusPassword,
    handleAuthError,
    isLoading,
    navigateToSignIn,
    onChangeText,
    onLoading,
    onSubmit,
    validate,
  } = useSignUp(navigation, emailRef, passwordRef);

  const styles = useAppStyles(createThemedStyles);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraHeight={80}
      extraScrollHeight={metrics.marginVertical}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      style={styles.keyboard}
    >
      <View style={styles.wrapper}>
        <View style={styles.normalSignUp}>
          <Logo />
          <TextInput
            placeholder={strings.auth.fullname}
            fieldName={fieldNames.fullName}
            onValueChange={onChangeText}
            ref={fullNameRef}
            onSubmitEditing={focusEmail}
            onBlur={validate}
            error={errors[fieldNames.fullName]}
            returnKeyType="next"
            maxLength={env.maxLength.fullname}
            editable={!isLoading}
          />
          <TextInput
            placeholder={strings.auth.email}
            fieldName={fieldNames.email}
            onValueChange={onChangeText}
            keyboardType="email-address"
            ref={emailRef}
            onSubmitEditing={focusPassword}
            onBlur={validate}
            error={errors[fieldNames.email]}
            returnKeyType="next"
            maxLength={env.maxLength.email}
            editable={!isLoading}
          />
          <PasswordInput
            placeholder={strings.auth.password}
            fieldName={fieldNames.password}
            onValueChange={onChangeText}
            onBlur={validate}
            error={errors[fieldNames.password]}
            ref={passwordRef}
            returnKeyType="done"
            maxLength={env.maxLength.password}
            editable={!isLoading}
          />
          <View>
            <FullButton
              text={strings.auth.signup.toUpperCase()}
              onPress={onSubmit}
              loading={isLoading}
            />
            <Typography
              color={Typography.colors.tertiary}
              style={styles.terms}
              type={Typography.types.headline5}
              text={
                withKeyword(
                  strings.auth.accept_terms,
                  { word: strings.auth.terms_and_conditions, link: strings.auth.tos_url },
                  { word: strings.auth.privacy_policy, link: strings.auth.privacy_policy_url },
                )
              }
            />
          </View>
        </View>
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={onLoading}
          disabled={isLoading}
          onError={handleAuthError}
        >
          <View style={styles.footerText}>
            <Typography
              type={Typography.types.textButtonLight}
              text={strings.auth.have_account}
            />
            <Typography type={Typography.types.textButtonLight} text=" " />
            <Typography
              color={Typography.colors.link}
              onPress={navigateToSignIn}
              type={Typography.types.textButton}
              text={strings.auth.signin}
            />
          </View>
        </SocialSignIn>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
