// Library Imports
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

// Local Imports
import strings from "../../i18n/strings";
import { styles } from "../../themes";
import EText from "../../components/common/EText";
import { getHeight, isIOS, moderateScale } from "../../common/constants";
import EHeader from "../../components/common/EHeader";
import ESafeAreaView from "../../components/common/ESafeAreaView";
import {
  Google_Icon,
  Facebook_Icon,
  Apple_Light,
  Apple_Dark,
  AppLogo,
} from "../../assets/svgs";
import { StackNav } from "../../navigation/NavigationKeys";
import EInput from "../../components/common/EInput";
import KeyBoardAvoidWrapper from "../../components/common/KeyBoardAvoidWrapper";
import { validateEmail, validatePassword } from "../../utils/validators";
import EButton from "../../components/common/EButton";

import { onGoogleButtonPress } from "../../firebase/SocialAuth";
import auth from "@react-native-firebase/auth";
import { address } from "../../assets/globalVar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const registrationAddress = `http://${address}:8080/registration`;
const registrationWithGoogleAddress = `http://${address}:8080/save-google-user`;

const Register = ({ navigation }) => {
  const colors = useSelector((state) => state.theme.theme);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  //Registrazione con google
  const onPressGoogleSign = async () => {
    setLoadingGoogle(true);
    onGoogleButtonPress()
      .then((userCredential) => {
        console.log("Login effettuato con Google");
        const user = userCredential.user;
        if (user) {
          fetch(registrationWithGoogleAddress, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              uid: user.uid,
            }),
          }).then((res) => {
            if (res.status === 200) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: StackNav.TabBar,
                    params: { title: strings.TabBar },
                  },
                ],
              });

              setLoadingGoogle(false);
            } else if (res.status === 409) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: StackNav.SetUpProfile,
                    params: { title: strings.SetUpProfile },
                  },
                ],
              });
              setLoadingGoogle(false);
            } else {
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Errore",
                textBody: "Errore interno, riprova più tardi.",
              });
              setLoadingGoogle(false);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/wrong-password"
        ) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody: "Credenziali errate, riprova.",
          });
          setLoadingGoogle(false);
        } else if (error.code === "auth/user-disabled") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody:
              "Questo account è stato disabilitato, contatta marketing@wayoutofficial.it",
          });
          setLoadingGoogle(false);
        } else if (error.code === "auth/network-request-failed") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody:
              "Errore di rete durante l'autenticazione, riprova più tardi!",
          });
          setLoadingGoogle(false);
        }
      })
      .finally(() => {
        setLoadingGoogle(false); // Nasconde lo spinner quando l'operazione è terminata
      });
  };

  const onPressAppleSign = async () => {};

  const socialIcon = [
    {
      name: "google",
      icon: <Google_Icon />,
      onPress: () => onPressGoogleSign(),
    },
    {
      name: "apple",
      icon: colors.dark === "dark" ? <Apple_Light /> : <Apple_Dark />,
      onPress: () => onPressAppleSign(),
    },
  ];

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [emailIcon, setEmailIcon] = React.useState(BlurredIconStyle);
  const [passwordIcon, setPasswordIcon] = React.useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [emailInputStyle, setEmailInputStyle] = React.useState(BlurredStyle);
  const [passwordInputStyle, setPasswordInputStyle] =
    React.useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(true);
  const [isCheck, setIsCheck] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const onFocusInput = (onHighlight) => onHighlight(FocusedStyle);
  const onFocusIcon = (onHighlight) => onHighlight(FocusedIconStyle);
  const onBlurInput = (onUnHighlight) => onUnHighlight(BlurredStyle);
  const onBlurIcon = (onUnHighlight) => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  const onChangedEmail = (val) => {
    const { msg } = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };
  const onChangedPassword = (val) => {
    const { msg } = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const RenderSocialBtn = memo(({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={item.onPress}
        style={[
          localStyles.socialBtn,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.bColor,
          },
        ]}
      >
        {item.icon}
      </TouchableOpacity>
    );
  });

  const onPressPasswordEyeIcon = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />;
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const PasswordIcon = () => (
    <Ionicons
      name="lock-closed"
      size={moderateScale(20)}
      color={passwordIcon}
    />
  );
  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity
      onPress={onPressPasswordEyeIcon}
      style={localStyles.eyeIconContainer}
    >
      <Ionicons
        name={isPasswordVisible ? "eye-off" : "eye"}
        size={moderateScale(20)}
        color={passwordIcon}
      />
    </TouchableOpacity>
  );

  const onPressSignIn = () => {
    navigation.navigate(StackNav.Login);
  };

  //Registrazione con email e password
  const onPressSignWithPassword = async () => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Account creato con successo!");
        const user = userCredential.user;
        if (user) {
          fetch(registrationAddress, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              uid: user.uid,
            }),
          }).then((res) => {
            if (res.status === 200) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: StackNav.VerifyProfileEmail,
                    params: {
                      title: strings.verifyProfile,
                      email: email,
                    },
                  },
                ],
              });
            } else {
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Errore",
                textBody: "Errore interno, riprova più tardi.",
              });
            }
            setLoading(false);
          });
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody: "Email è già registrata.",
          });
          setLoading(false);
        } else if (error.code === "auth/invalid-email") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody: "Indirizzo email non valido.",
          });
          setLoading(false);
        } else if (error.code === "auth/network-request-failed") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody:
              "Errore di rete durante l'autenticazione, riprova più tardi!",
          });
          setLoading(false);
        }
        console.error(error);
      });
  };

  const GoogleLoginSpinner = () => (
    <View style={[localStyles.spinnerContainer]}>
      <ActivityIndicator color="black" />
    </View>
  );

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        {loadingGoogle && <GoogleLoginSpinner />}
        <EHeader />
        <KeyBoardAvoidWrapper>
          <View style={[localStyles.mainContainer, styles.flexCenter]}>
            {colors.dark === "dark" ? (
              <Image
                source={require("../../assets/myimages/logo/white_logo_no_bg.png")}
                style={localStyles.logo}
              />
            ) : (
              <Image
                source={require("../../assets/myimages/logo/black_logo_no_bg.png")}
                style={localStyles.logo}
              />
            )}
            <EText type={"b30"} align={"center"} style={styles.mb20}>
              {strings.createYourAccount}
            </EText>
            <EInput
              placeHolder={strings.email}
              keyBoardType={"email-address"}
              _value={email}
              _errorText={emailError}
              autoCapitalize={"none"}
              insideLeftIcon={() => <EmailIcon />}
              toGetTextFieldValue={onChangedEmail}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerStyle,
                emailInputStyle,
              ]}
              inputBoxStyle={[localStyles.inputBoxStyle]}
              _onFocus={onFocusEmail}
              onBlur={onBlurEmail}
            />

            <EInput
              placeHolder={strings.password}
              keyBoardType={"default"}
              _value={password}
              _errorText={passwordError}
              autoCapitalize={"none"}
              insideLeftIcon={() => <PasswordIcon />}
              toGetTextFieldValue={onChangedPassword}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerStyle,
                passwordInputStyle,
              ]}
              _isSecure={isPasswordVisible}
              inputBoxStyle={[localStyles.inputBoxStyle]}
              _onFocus={onFocusPassword}
              onBlur={onBlurPassword}
              rightAccessory={() => <RightPasswordEyeIcon />}
            />

            <EButton
              title={strings.signUp}
              type={"S16"}
              color={isSubmitDisabled && colors.white}
              containerStyle={[localStyles.signBtnContainer]}
              onPress={onPressSignWithPassword}
              bgColor={isSubmitDisabled && colors.primaryD}
              disabled={isSubmitDisabled}
              loading={loading}
            />
            <View style={localStyles.divider}>
              <View
                style={[
                  localStyles.orContainer,
                  { backgroundColor: colors.bColor },
                ]}
              />
              <EText type={"s18"} style={styles.mh10}>
                {strings.orContinueWith}
              </EText>
              <View
                style={[
                  localStyles.orContainer,
                  { backgroundColor: colors.bColor },
                ]}
              />
            </View>

            <View style={localStyles.socialBtnContainer}>
              {socialIcon.map(
                (item, index) =>
                  ((item.name == "apple" && !!isIOS) ||
                    item.name === "google") && (
                    <RenderSocialBtn item={item} key={index.toString()} />
                  )
              )}
            </View>

            <TouchableOpacity
              onPress={onPressSignIn}
              style={localStyles.signUpContainer}
            >
              <EText
                type={"b16"}
                color={colors.dark ? colors.grayScale7 : colors.grayScale5}
              >
                {strings.AlreadyHaveAccount}
              </EText>
              <EText type={"b16"} color={colors.primary5}>
                {" "}
                {strings.signIn}
              </EText>
            </TouchableOpacity>
          </View>
        </KeyBoardAvoidWrapper>
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default Register;

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
  },
  loginImage: {
    height: getHeight(160),
    width: "80%",
    ...styles.mv20,
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  orContainer: {
    height: moderateScale(1),
    width: "30%",
  },
  signBtnContainer: {
    ...styles.center,
    width: "100%",
    ...styles.mv20,
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  checkboxContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
  socialBtnContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  socialBtn: {
    ...styles.center,
    height: getHeight(60),
    width: moderateScale(90),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.mh10,
  },

  logo: {
    width: moderateScale(305),
    height: moderateScale(92),
    marginBottom: 50,
  },

  errorMessageContainer: {
    backgroundColor: "#eb4034",
    borderRadius: moderateScale(10),
    padding: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  errorMessageText: {
    color: "white",
    fontWeight: "bold",
  },

  spinnerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 999,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgba(220, 220, 220, 0.5)",
  },
});
