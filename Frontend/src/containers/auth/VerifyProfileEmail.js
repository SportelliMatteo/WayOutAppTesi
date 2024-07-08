// Library import
import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CountDown from "new-react-native-countdown-component";

// Local import
import ESafeAreaView from "../../components/common/ESafeAreaView";
import EHeader from "../../components/common/EHeader";
import strings from "../../i18n/strings";
import EText from "../../components/common/EText";
import KeyBoardAvoidWrapper from "../../components/common/KeyBoardAvoidWrapper";
import { styles } from "../../themes";
import { getHeight, moderateScale } from "../../common/constants";
import { StackNav } from "../../navigation/NavigationKeys";
import typography from "../../themes/typography";
import EButton from "../../components/common/EButton";
import { useRoute } from "@react-navigation/native";
import { Email_Icon } from "../../assets/svgs";
import auth from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const VerifyProfileEmail = ({ navigation }) => {
  const route = useRoute();
  const { title, email } = route.params;
  const colors = useSelector((state) => state.theme.theme);
  const [counterId, setCounterId] = useState("1");
  const [isTimeOver, setIsTimeOver] = useState(false);

  const partialEmail = email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2"); //Per censurare l'email

  const onFinishTimer = () => setIsTimeOver(true);

  //Reinvio dell'email di conferma
  const onPressResend = async () => {
    auth().currentUser.reload();
    if (auth().currentUser.emailVerified === false) {
      auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          console.log("Email di verifica inviata")
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Invio riuscito",
            textBody: "Controlla la tua email.",
          });
          setCounterId(counterId + "1");
          setIsTimeOver(false);
        })
        .catch((error) => {
          if (error.code === "auth/too-many-requests") {
            Toast.show({
              type: ALERT_TYPE.ERROR,
              title: "Errore",
              textBody: "Troppe richieste, riprova più tardi.",
            });
          } else {
            Toast.show({
              type: ALERT_TYPE.ERROR,
              title: "Errore",
              textBody: "Errore interno, riprova più tardi.",
            });
          }
          setCounterId(counterId + "1");
          setIsTimeOver(false);
        });
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Attenzione",
        textBody: "Email già confermata, vai al login.",
      });
    }
  };

  const onPressGoToLogin = async () => {
    navigation.navigate(StackNav.Login);
  };

  //Reinvio dell'email appena si apre la pagina
  useEffect(() => {
    auth()
      .currentUser.sendEmailVerification()
      .catch((error) => {
        if (error.code === "auth/too-many-requests") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Errore",
            textBody: "Troppe richieste, riprova più tardi!",
          });
        }
      });
    console.log("Email di conferma inviata");
  }, []);

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={strings.verifyProfile} isHideBack />
        <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
          <View style={localStyles.root}>
            <EText type={"r18"} align={"center"} style={styles.mb20}>
              {strings.verifyEmail}
              <EText style={{ fontWeight: "bold" }}>{partialEmail}</EText>
            </EText>
            <Email_Icon style={[styles.mb40]} />

            <View style={styles.rowCenter}>
              {isTimeOver ? (
                <TouchableOpacity
                  onPress={onPressResend}
                  disabled={isTimeOver ? false : true}
                  style={styles.p5}
                >
                  <View style={{display:"flex", flexDirection:"row"}}>
                    <EText type={"r16"} color={colors.black} align={"center"}>
                      {" "}
                      {strings.resendEmailText}
                    </EText>
                    <EText
                      type={"b16"}
                      color={colors.primary5}
                      align={"center"}
                    >
                      {" "}
                      {strings.resendEmail}
                    </EText>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.rowCenter}>
                  <EText type={"m18"} color={colors.grayScale3}>
                    {strings.resendEmailIn}
                  </EText>
                  <CountDown
                    id={counterId}
                    until={30}
                    onFinish={onFinishTimer}
                    digitStyle={{ backgroundColor: colors.backgroundColor }}
                    digitTxtStyle={{
                      ...localStyles.digitStyle,
                      color: colors.textColor,
                    }}
                    timeToShow={["S"]}
                    timeLabels={{ m: null, s: null }}
                  />
                  <EText
                    type={"m18"}
                    color={colors.grayScale3}
                    align={"center"}
                  >
                    {strings.second}
                  </EText>
                </View>
              )}
            </View>
          </View>
          <EText type={"m18"} align={"center"}>
            {strings.emailAlreadyConfirmed}
          </EText>
          <EButton
            type={"S16"}
            title={strings.goToLogin}
            onPress={onPressGoToLogin}
            containerStyle={localStyles.btnContainerStyle}
          />
        </KeyBoardAvoidWrapper>
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default VerifyProfileEmail;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph30,
    ...styles.justifyCenter,
    ...styles.flex,
    alignItems: "center",
  },
  pinInputStyle: {
    height: getHeight(60),
    width: moderateScale(75),
    fontSize: moderateScale(26),
    borderRadius: moderateScale(15),
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mv10,
  },
  inputStyle: {
    height: getHeight(60),
    ...styles.mv30,
  },
  digitStyle: {
    fontSize: moderateScale(18),
    ...typography.fontWeights.Regular,
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

  confirmMessageContainer: {
    backgroundColor: "green",
    borderRadius: moderateScale(10),
    padding: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  confirmMessageText: {
    color: "white",
    fontWeight: "bold",
  },
});
