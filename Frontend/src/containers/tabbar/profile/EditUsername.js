// Libraries import
import { StyleSheet} from "react-native";
import React, {  useState, useContext } from "react";
import { useSelector } from "react-redux";

// Local import
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import EHeader from "../../../components/common/EHeader";
import strings from "../../../i18n/strings";
import { styles } from "../../../themes";
import { getHeight, moderateScale } from "../../../common/constants";
import EInput from "../../../components/common/EInput";
import KeyBoardAvoidWrapper from "../../../components/common/KeyBoardAvoidWrapper";
import EButton from "../../../components/common/EButton";
import EText from "../../../components/common/EText";
import { address } from "../../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import {
  isEmpty,
} from "../../../utils/validators";
import { UserLoggedContext } from "../../../context/UserLoggedContext";

const updateUserUsernameAddress = `http://${address}:8080/update-user-username`;

const EditUsername = (props) => {
  const { userLogged, setUserLogged } = useContext(UserLoggedContext);

  const colors = useSelector((state) => state.theme.theme);
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  const [username, setUsername] = useState(userLogged.nomeUtente);
  const [usernameInputStyle, setUsernameInputStyle] = useState(BlurredStyle);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false)

  const onFocusInput = (onHighlight) => onHighlight(FocusedStyle);
  const onBlurInput = (onUnHighlight) => onUnHighlight(BlurredStyle);

  const onFocusUsername = () => onFocusInput(setUsernameInputStyle);

  const onBlurUsername = () => onBlurInput(setUsernameInputStyle);

  const onChangedUsername = (text) => setUsername(text);

  //Informazioni utente
  const onPressContinue = async () => {
    setLoading(true)
    if (
      isEmpty(username)
    ) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Il nome utente è obbligatorio",
      });
      setLoading(false)
      return;
    }
    fetch(updateUserUsernameAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeutente: username,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setUserLogged(result["user"]));
        setButtonDisabled(true);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Modifica username",
          textBody: "Modifica avvenuta con successo",
        });
        setLoading(false)
      } else if (res.status === 409) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Questo username è già esistente",
        });
        setLoading(false)
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

 
  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={strings.editUsername} />
        <KeyBoardAvoidWrapper containerStyle={styles.p20}>
          <EText type={'b16'}>Username</EText>
          <EInput
            placeHolder={strings.username}
            _value={username}
            autoCapitalize={"none"}
            toGetTextFieldValue={onChangedUsername}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
              usernameInputStyle,
            ]}
            _onFocus={onFocusUsername}
            onBlur={onBlurUsername}
          />
        </KeyBoardAvoidWrapper>

        <EButton
          type={"S16"}
          title={strings.edit}
          color={colors.white}
          onPress={onPressContinue}
          containerStyle={localStyles.continueBtnStyle}
          disabled = {buttonDisabled}
          loading={loading}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default EditUsername;

const localStyles = StyleSheet.create({
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  dropdownStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mt15,
  },
  btnContainer: {
    ...styles.p20,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: "45%",
  },
  dobStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mt10,
    ...styles.mb5,
    ...styles.rowSpaceBetween,
  },
  continueBtnStyle: {
    ...styles.mh20,
    ...styles.mb10,
  },
  countryPickerButton: {
    ...styles.alignStart,
    ...styles.justifyCenter,
  },
});
