// Library Imports
import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Appearance } from "react-native";

// Local Imports
import { colors, styles } from "../../themes";
import { StackNav } from "../../navigation/NavigationKeys";
import { changeThemeAction } from "../../redux/action/themeAction";
import { initialStorageValueGet } from "../../utils/asyncstorage";
import ESafeAreaView from "../../components/common/ESafeAreaView";
import auth from "@react-native-firebase/auth";
import { address } from "../../assets/globalVar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const checkUserAddress = `http://${address}:8080/check-user`;

const Splash = ({ navigation }) => {
  const color = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  const asyncProcess = async () => {
    try {
      let asyncData = await initialStorageValueGet();
      let { themeColor, onBoardingValue } = asyncData;
      if (!!asyncData) {
        if (!!themeColor) {
          if (themeColor === "light") {
            dispatch(changeThemeAction(colors.light));
          } else {
            dispatch(changeThemeAction(colors.dark));
          }
        } else {
          if (Appearance.getColorScheme() === "dark") {
            dispatch(changeThemeAction(colors.dark));
          } else {
            dispatch(changeThemeAction(colors.light));
          }
        }

        const user = auth().currentUser;
        if (user && user.emailVerified === true) {
          fetch(checkUserAddress, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
            }),
          }).then((res) => {
            if (res.status === 200) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: StackNav.TabBar,
                  },
                ],
              });
            } else if (res.status === 409) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: StackNav.Auth,
                  },
                ],
              });
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Errore",
                textBody:
                  "Non hai completato la registrazione, devi effettuare nuovamente l'accesso",
              });
            } else {
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Errore",
                textBody: "Errore interno, riprova più tardi.",
              });
            }
          });
        } else if (onBoardingValue) {
          navigation.replace(StackNav.Auth);
        } else {
          navigation.replace(StackNav.onBoarding);
        }
      }
    } catch (e) {
      console.log("error ", e);
    }
  };

  useEffect(() => {
    SplashScreen.hide();
    asyncProcess();
  }, []);

  return (
    <AlertNotificationRoot>
      <ESafeAreaView style={localStyles.container}>
        <ActivityIndicator size="large" color={color.darkColor} />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default Splash;

const localStyles = StyleSheet.create({
  container: {
    ...styles.itemsCenter,
    ...styles.flex,
    ...styles.justifyCenter,
  },
});
