import { ScrollView, StyleSheet, View } from "react-native";
import React, { memo, useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Custom Imports
import ESafeAreaView from "../../components/common/ESafeAreaView";
import EHeader from "../../components/common/EHeader";
import strings from "../../i18n/strings";
import { styles } from "../../themes";
import EText from "../../components/common/EText";
import {
  ForgotPassword_Dark,
  ForgotPassword_Light,
} from "../../assets/svgs";
import { getHeight, moderateScale } from "../../common/constants";
import { StackNav } from "../../navigation/NavigationKeys";
import EButton from "../../components/common/EButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { validateEmail } from "../../utils/validators";
import auth from "@react-native-firebase/auth";
import { address } from "../../assets/globalVar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const checkForgotPasswordEmailAddress = `http://${address}:8080/check-forgot-password-email`;

const ForgotPassword = () => {
  const colors = useSelector((state) => state.theme.theme);
  const [email, setEmail] = useState("");
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [emailError, setEmailError] = useState("");
  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  const onFocusInput = (onHighlight) => onHighlight(FocusedStyle);
  const onFocusIcon = (onHighlight) => onHighlight(FocusedIconStyle);
  const onBlurInput = (onUnHighlight) => onUnHighlight(BlurredStyle);
  const onBlurIcon = (onUnHighlight) => onUnHighlight(BlurredIconStyle);

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  //Password dimenticata
  const onPressSend = () => {
    setLoading(true)
    fetch(checkForgotPasswordEmailAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((res) => {
      if (res.status === 200) {
        auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            setEmail("");
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Invio riuscito",
              textBody: "Controlla la tua email.",
            });
            setLoading(false)
          })
          .catch((error) => {
            
            console.log(error);
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Errore",
              textBody: "Errore interno, riprova più tardi.",
            });
            setLoading(false)
          });
      } else if (res.status === 402) {
        setLoading(false)
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Attenzione",
          textBody: "Questa email non risulta registrata.",
        });
        setLoading(false)
        return;
      } else {
        setLoading(false)
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
        setLoading(false)
      }
    });
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />;
  };

  const onChangedEmail = (val) => {
    const { msg } = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };

  useEffect(() => {
    if (email.length > 0 && !emailError) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, emailError]);

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={strings.forgotPassword} />
        <ScrollView bounces={false} contentContainerStyle={localStyles.root}>
          <View style={[styles.mv20, styles.selfCenter]}>
            {colors.dark ? (
              <ForgotPassword_Dark
                width={moderateScale(200)}
                height={getHeight(190)}
              />
            ) : (
              <ForgotPassword_Light
                width={moderateScale(200)}
                height={getHeight(190)}
              />
            )}
          </View>
          <EText type={"r18"} style={[styles.mt10, styles.mb10]}>
            {strings.forgotPasswordDesc}
          </EText>
          <View>
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
          </View>
        </ScrollView>
        <EButton
          type={"S16"}
          title={strings.send}
          onPress={onPressSend}
          containerStyle={localStyles.btnContainerStyle}
          loading={loading}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default ForgotPassword;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.justifyCenter,
    ...styles.flex,
  },
  mainContainer: {
    ...styles.p15,
    ...styles.flexRow,
    ...styles.mt20,
    ...styles.itemsCenter,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(30),
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mb10,
    ...styles.mt20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
});
