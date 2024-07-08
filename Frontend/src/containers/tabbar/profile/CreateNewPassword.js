import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";

// Custom Imports
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import EHeader from "../../../components/common/EHeader";
import strings from "../../../i18n/strings";
import { styles } from "../../../themes";
import EText from "../../../components/common/EText";
import {
  ForgotPassword_Dark,
  ForgotPassword_Light,
} from "../../../assets/svgs";
import { getHeight, moderateScale } from "../../../common/constants";
import EButton from "../../../components/common/EButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import auth from "@react-native-firebase/auth";
import { address } from "../../../assets/globalVar";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { UserLoggedContext } from "../../../context/UserLoggedContext";

const checkForgotPasswordEmailAddress = `http://${address}:8080/check-forgot-password-email`;

const CreateNewPassword = () => {

  const {userLogged} = useContext(UserLoggedContext)

  const colors = useSelector((state) => state.theme.theme);
  const [email, setEmail] = useState(userLogged.email);
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false)
  const BlurredIconStyle = colors.grayScale5;

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
      setButtonDisabled(true);
      if (res.status === 200) {
        auth()
          .sendPasswordResetEmail(email)
          .then(() => {
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
      } else {
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

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={strings.createNewPassword} />
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
            {strings.newPasswordDesc}
          </EText>
          <View>
            <EInput
              placeHolder={strings.email}
              keyBoardType={"email-address"}
              _value={email}
              editable={false}
              autoCapitalize={"none"}
              insideLeftIcon={() => <EmailIcon />}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerStyle,
              ]}
              inputBoxStyle={[localStyles.inputBoxStyle]}
            />
          </View>
        </ScrollView>
        <EButton
          type={"S16"}
          title={strings.send}
          onPress={onPressSend}
          containerStyle={localStyles.btnContainerStyle}
          disabled = {buttonDisabled}
          loading={loading}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default CreateNewPassword;

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
