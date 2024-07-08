// Libraries import
import { StyleSheet, Image, TouchableOpacity, View, ScrollView } from "react-native";
import React, { createRef, useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CountryPicker, {
  FlagButton,
  DARK_THEME,
  DEFAULT_THEME,
} from "react-native-country-picker-modal";

// Local import
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import EHeader from "../../../components/common/EHeader";
import strings from "../../../i18n/strings";
import images from "../../../assets/images";
import { styles } from "../../../themes";
import { getHeight, getWidth, moderateScale } from "../../../common/constants";
import EInput from "../../../components/common/EInput";
import KeyBoardAvoidWrapper from "../../../components/common/KeyBoardAvoidWrapper";
import { StackNav } from "../../../navigation/NavigationKeys";
import ProfilePicture from "../../../components/models/ProfilePicture";
import EButton from "../../../components/common/EButton";
import { GenderData } from "../../../api/constant";
import { EditDark, EditLight } from "../../../assets/svgs";
import EText from "../../../components/common/EText";
import { address } from "../../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import {
  isEmpty,
  isValidPhoneNo,
  isValidUsername,
} from "../../../utils/validators";
import { UserLoggedContext } from "../../../context/UserLoggedContext";

const updateUserAddress = `http://${address}:8080/update-user-in-edit-profile`;

const ProfileInformation = () => {
  const { userLogged, setUserLogged } = useContext(UserLoggedContext);

  const colors = useSelector((state) => state.theme.theme);
  const ProfilePictureSheetRef = createRef();
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary5,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary5;

  const [name, setName] = useState(userLogged.nome);
  const [surname, setSurname] = useState(userLogged.cognome);
  const [phoneNo, setPhoneNo] = useState(userLogged.telefono);
  const [gender, setGender] = useState(userLogged.sesso);
  const [nameInputStyle, setNameInputStyle] = useState(BlurredStyle);
  const [surnameInputStyle, setSurnameInputStyle] = useState(BlurredStyle);
  const [phoneNoInputStyle, setPhoneNoInputStyle] = useState(BlurredStyle);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(userLogged.dataDiNascita);
  const [latitude, setLatitudine] = useState(userLogged.latitude);
  const [longitude, setLongitudine] = useState(userLogged.longitude);
  const [indirizzo, setIndirizzo] = useState(userLogged.indirizzo);
  const [city, setCity] = useState(userLogged.city);
  const [state, setState] = useState(userLogged.state);
  const [chevronDown, setChevronDown] = useState(BlurredIconStyle);
  const [selectImage, setSelectImage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const [callingCodeLib, setCallingCodeLib] = useState(
    userLogged.prefissoTelefonico
  );
  const [countryCodeLib, setCountryCodeLib] = useState(
    userLogged.statoTelefono
  );
  const [visiblePiker, setVisiblePiker] = useState(false);

  const onFocusInput = (onHighlight) => onHighlight(FocusedStyle);
  const onFocusIcon = (onHighlight) => onHighlight(FocusedIconStyle);
  const onBlurInput = (onUnHighlight) => onUnHighlight(BlurredStyle);
  const onBlurIcon = (onUnHighlight) => onUnHighlight(BlurredIconStyle);

  const onFocusName = () => onFocusInput(setNameInputStyle);
  const onFocusSurname = () => onFocusInput(setSurnameInputStyle);
  const onFocusPhoneNo = () => {
    onFocusInput(setPhoneNoInputStyle);
    onFocusIcon(setChevronDown);
  };

  const onBlurName = () => onBlurInput(setNameInputStyle);
  const onBlurSurname = () => onBlurInput(setSurnameInputStyle);
  const onBlurPhoneNo = () => {
    onBlurInput(setPhoneNoInputStyle);
    onBlurIcon(setChevronDown);
  };

  const onChangedName = (text) => setName(text);
  const onChangedSurname = (text) => setSurname(text);
  const onChangedNickName = (text) => setNickname(text);
  const onChangedPhoneNo = (text) => setPhoneNo(text);
  const onChangedGender = (text) => setGender(text.value.toLowerCase());

  const onSelectCountry = (country) => {
    setCountryCodeLib(country.cca2);
    setCallingCodeLib("+" + country.callingCode[0]);
    closeCountryPicker();
  };

  const openCountryPicker = () => setVisiblePiker(true);
  const closeCountryPicker = () => setVisiblePiker(false);

  const handleDateConfirm = (date) => {
    var expiryDate = date.toISOString().split("T")[0];
    const day = expiryDate.split("-")[2];
    const month = expiryDate.split("-")[1];
    const year = expiryDate.split("-")[0];
    setDateOfBirth(day + "/" + month + "/" + year);
    setDatePickerVisible(false);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  const onPressCalender = () => setDatePickerVisible(true);

  const countryIcon = () => {
    return (
      <View style={styles.rowSpaceBetween}>
        <FlagButton
          value={callingCodeLib}
          onOpen={openCountryPicker}
          withEmoji={true}
          countryCode={countryCodeLib}
          withCallingCodeButton={true}
          containerButtonStyle={localStyles.countryPickerButton}
        />
        <Ionicons
          name="chevron-down-outline"
          size={moderateScale(20)}
          color={chevronDown}
        />
      </View>
    );
  };

  const handlePlaceSelect = (data, details) => {
    setLatitudine(details.geometry.location.lat);
    setLongitudine(details.geometry.location.lng);
    setIndirizzo(data.description);

    if (data.terms.length == 4) {
      setCity(data.terms[1].value);
      setState(data.terms[3].value);
    } else if (data.terms.length == 5) {
      setCity(data.terms[2].value);
      setState(data.terms[4].value);
    } else {
      setCity(data.terms[0].value);
      setState(data.terms[2].value);
    }
  };

  useEffect(()=>{
    ref?.current?.setAddressText(userLogged.indirizzo);
  },[])

  //Informazioni utente
  const onPressContinue = async () => {
    setLoading(true);
    if (
      isEmpty(name) ||
      isEmpty(surname) ||
      isEmpty(dateOfBirth) ||
      isEmpty(phoneNo) ||
      isEmpty(gender)
    ) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Alcuni campi sono vuoti",
      });
      setLoading(false);
      return;
    }
    if (!isValidPhoneNo(phoneNo)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Il numero di telefono non è valido",
      });
      setLoading(false);
      return;
    }
    fetch(updateUserAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: name,
        cognome: surname,
        dataDiNascita: dateOfBirth,
        statotelefono: countryCodeLib,
        prefissotelefono: callingCodeLib,
        telefono: phoneNo,
        sesso: gender,
        uid: auth().currentUser.uid,
        image: selectImage.data,
        indirizzo: indirizzo,
        citta: city,
        stato: state,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setUserLogged(result["user"]));
        setButtonDisabled(true);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Modifica profilo",
          textBody: "Modifica avvenuta con successo",
        });
        setLoading(false);
      } else if (res.status === 409) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Questo username è già esistente",
        });
        setLoading(false);
      } else if (res.status === 403) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Ci dispiace, è necessario avere almeno 18 anni.",
        });
        setLoading(false);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
        setLoading(false);
      }
    });
  };

  //Immagine di profilo
  const onPressCamera = () => {
    ImagePicker.openCamera({
      // cropping: true,
      mediaType: "photo",
      includeBase64: true,
      compressImageQuality: 1,
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
    })
      .then((image) => {
        // Immagine acquisita con successo
        setSelectImage(image);
      })
      .catch((error) => {
        ProfilePicture;
        // Gestione dell'errore
        console.log("Errore durante l'apertura della fotocamera:", error);
      });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      includeBase64: true,
      compressImageQuality: 1,
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
    }).then((images) => {
      setSelectImage(images);
    });
  };

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage]);

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={strings.editProfile} />
        <KeyBoardAvoidWrapper containerStyle={styles.p20}>
          <TouchableOpacity
            onPress={onPressProfilePic}
            style={[styles.selfCenter, styles.mb20]}
          >
            {!!selectImage ? (
              <Image
                source={{ uri: selectImage.path }}
                style={localStyles.userImage}
              />
            ) : (
              <Image
                source={
                  userLogged.profileImages &&
                  userLogged.profileImages.length > 0
                    ? { uri: userLogged.profileImages[0] }
                    : colors.dark
                    ? images.userDark
                    : images.userLight
                }
                style={localStyles.userImage}
              />
            )}
            <View style={localStyles.editIcon}>
              {colors.dark ? <EditDark /> : <EditLight />}
            </View>
          </TouchableOpacity>

          <EInput
            placeHolder={strings.name}
            _value={name}
            autoCapitalize={"none"}
            toGetTextFieldValue={onChangedName}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
              nameInputStyle,
            ]}
            _onFocus={onFocusName}
            onBlur={onBlurName}
          />
          <EInput
            placeHolder={strings.surname}
            _value={surname}
            autoCapitalize={"none"}
            toGetTextFieldValue={onChangedSurname}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
              surnameInputStyle,
            ]}
            _onFocus={onFocusSurname}
            onBlur={onBlurSurname}
          />

          <TouchableOpacity
            onPress={onPressCalender}
            style={[
              localStyles.dobStyle,
              { borderColor: colors.bColor, backgroundColor: colors.inputBg },
            ]}
          >
            <EText
              type={"r16"}
              color={dateOfBirth ? colors.textColor : colors.grayScale5}
            >
              {dateOfBirth ? dateOfBirth : strings.dob}
            </EText>
            <Ionicons
              name="calendar"
              size={moderateScale(20)}
              color={colors.grayScale5}
              style={styles.mr5}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            date={new Date()}
          />
          {/*<EInput
          placeHolder={strings.email}
          keyBoardType={'email-address'}
          _value={email}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedEmail}
          rightAccessory={() => <EmailIcon />}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            emailInputStyle,
          ]}
          _onFocus={onFocusEmail}
          onBlur={onBlurEmail}
        />*/}
          <EInput
            placeHolder={strings.phoneNumber}
            keyBoardType={"number-pad"}
            _value={phoneNo}
            _maxLength={10}
            toGetTextFieldValue={onChangedPhoneNo}
            insideLeftIcon={countryIcon}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
              phoneNoInputStyle,
            ]}
            _onFocus={onFocusPhoneNo}
            onBlur={onBlurPhoneNo}
          />
          {/* L'aggiunta di questa ScrollView "inutile" fixa il warning relativo alle Virtualized Lists*/}
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={{ width: "100%" }}
          >
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Città o indirizzo"
              enablePoweredByContainer={false}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              fetchDetails={true}
              onPress={handlePlaceSelect}
              minLength={3}
              query={{
                key: process.env.GOOGLEAPIKEY,
                language: "it",
              }}
              styles={{
                container: {
                  width: getWidth(380),
                  alignItems: "center",
                  zIndex: 999,
                },
                textInput: {
                  backgroundColor: "transparent",
                  fontSize: 16,
                  marginTop: 5,
                  color: colors.textColor,
                },
                separator: {
                  backgroundColor: "transparent",
                },
                description: {
                  color: colors.textColor,
                },
                row: {
                  backgroundColor: colors.inputBg,
                  borderRadius: 5,
                  alignSelf: "center",
                  width: getWidth(395),
                },
              }}
              textInputProps={{
                InputComp: EInput,
                autoCapitalize: "none",
                inputContainerStyle: [
                  {
                    backgroundColor: colors.inputBg,
                    width: getWidth(380),
                  },
                  localStyles.inputContainerStyle,
                ],
              }}
            />
          </ScrollView>

          <Dropdown
            style={[
              localStyles.dropdownStyle,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
                color: colors.white,
              },
            ]}
            placeholderStyle={{ color: colors.grayScale5 }}
            data={GenderData}
            maxHeight={moderateScale(180)}
            labelField="label"
            valueField="value"
            placeholder={strings.gender}
            value={gender}
            itemTextStyle={{
              color: colors.textColor,
              fontSize: moderateScale(16),
            }}
            onChange={onChangedGender}
            selectedTextStyle={{
              color: colors.textColor,
            }}
            itemContainerStyle={{
              backgroundColor: colors.inputBg,
            }}
            activeColor={colors.inputBg}
          />
        </KeyBoardAvoidWrapper>

        <EButton
          type={"S16"}
          title={strings.edit}
          color={colors.white}
          onPress={onPressContinue}
          containerStyle={localStyles.continueBtnStyle}
          disabled={buttonDisabled}
          loading={loading}
        />
        <ProfilePicture
          onPressCamera={onPressCamera}
          onPressGallery={onPressGallery}
          SheetRef={ProfilePictureSheetRef}
        />
        <CountryPicker
          countryCode={"IT"}
          withFilter={true}
          visible={visiblePiker}
          withFlag={true}
          withFlagButton={true}
          onSelect={(country) => onSelectCountry(country)}
          withCallingCode={true}
          withAlphaFilter={true}
          withCountryNameButton={true}
          onClose={closeCountryPicker}
          renderFlagButton={() => {
            return null;
          }}
          theme={colors.dark ? DARK_THEME : DEFAULT_THEME}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default ProfileInformation;

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
