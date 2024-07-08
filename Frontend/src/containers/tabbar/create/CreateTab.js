// Libraries import
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { createRef, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import strings from "../../../i18n/strings";
import { styles } from "../../../themes";
import { getHeight, getWidth, moderateScale } from "../../../common/constants";
import EInput from "../../../components/common/EInput";
import KeyBoardAvoidWrapper from "../../../components/common/KeyBoardAvoidWrapper";
import EButton from "../../../components/common/EButton";
import { EventType } from "../../../api/constant";
import EText from "../../../components/common/EText";
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ImagePicker from "react-native-image-crop-picker";
import CoverImage from "../../../components/models/CoverImage";
import auth from "@react-native-firebase/auth";
import { address } from "../../../assets/globalVar";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { isEmpty } from "../../../utils/validators";
import { check } from "prettier";

const createEventAddress = `http://${address}:8080/create-event`;
const getAllCitiesAddress = `http://${address}:8080/get-all-cities-name`;
const getAllClubsByCityAddress = `http://${address}:8080/get-all-clubs-by-city`;

const CreateTab = (props) => {
  const colors = useSelector((state) => state.theme.theme);
  const { userLogged } = useContext(UserLoggedContext);

  const [eventType, setEventType] = useState(
    EventType[0].value.toLocaleLowerCase()
  );
  const [eventName, setEventName] = useState("");
  const [cities, setCities] = useState([]);
  const [clubCity, setClubCity] = useState("");
  const [club, setClub] = useState("");
  const [clubs, setClubs] = useState([]);
  const [clubName, setClubName] = useState("");
  const [cityClub, setCityClub] = useState("");
  const [drinkPreferences, setDrinkPreferences] = useState("");
  const [manSeats, setManSeats] = useState("");
  const [manPrice, setManPrice] = useState("");
  const [womanSeats, setWomanSeats] = useState("");
  const [womanPrice, setWomanPrice] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [isCheck, setIsCheck] = useState(true);
  const [loading, setLoading] = useState(false);

  const onChangedEventType = (text) => setEventType(text.value.toLowerCase());
  const onChangedEventName = (text) => setEventName(text);
  const onChangedCity = (text) => {
    setCityClub(text.value);
    getAllClubByCity(text.value);
  };
  const onChangedClub = (club) => {
    setClub(club.value);
    setClubName(club.label);
  };
  const onChangedDrinkPreferences = (text) => setDrinkPreferences(text);
  const onChangedManSeats = (text) => setManSeats(text);
  const onChangedManPrice = (text) => setManPrice(text);
  const onChangedWomanSeats = (text) => setWomanSeats(text);
  const onChangedWomanPrice = (text) => setWomanPrice(text);
  const handleDateConfirm = (date) => {
    var expiryDate = date.toISOString().split("T")[0];
    const day = expiryDate.split("-")[2];
    const month = expiryDate.split("-")[1];
    const year = expiryDate.split("-")[0];
    setEventDate(day + "/" + month + "/" + year);
    setDatePickerVisible(false);
  };
  const hideDatePicker = () => setDatePickerVisible(false);
  const onPressCalender = () => setDatePickerVisible(true);

  //COVER
  const [selectImage, setSelectImage] = useState("");
  const CoverImageSheetRef = createRef();
  const onPressCoverImage = () => CoverImageSheetRef?.current.show();

  useEffect(() => {
    CoverImageSheetRef?.current?.hide();
  }, [selectImage]);

  const onPressCamera = () => {
    ImagePicker.openCamera({
      // cropping: true,
      mediaType: "photo",
      includeBase64: true,
    }).then((image) => {
      setSelectImage(image);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      includeBase64: true,
    }).then((images) => {
      setSelectImage(images);
    });
  };

  //Indirizzo
  const [latitude, setLatitudine] = useState("");
  const [longitude, setLongitudine] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const handlePlaceSelect = async (data, details) => {
    setLatitudine(details.geometry.location.lat);
    setLongitudine(details.geometry.location.lng);
    setAddress(data.description);

    if (data.terms.length == 4) {
      setCity(data.terms[1].value);
    } else if (data.terms.length == 5) {
      setCity(data.terms[2].value);
    } else {
      setCity(data.terms[0].value);
    }
  };

  //PUBBLICA EVENTO
  const onPressContinue = async () => {
    setLoading(true)
    if (
      isEmpty(eventName) ||
      isEmpty(drinkPreferences) ||
      isEmpty(eventDate) ||
      isEmpty(manSeats) ||
      isEmpty(manPrice) ||
      isEmpty(womanSeats) ||
      isEmpty(womanPrice)
    ) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Alcuni campi sono vuoti",
      });
      setLoading(false)
      return;
    }
    if(manPrice === "0" || womanPrice === "0"){
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "L'importo inserito deve essere almeno di 1 euro",
      });
      setLoading(false)
      return;
    }
    if (isEmpty(selectImage)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "La copertina è obbligatoria",
      });
      setLoading(false)
      return;
    }
    if (isCheck) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Devi accettare termini e condizioni per proseguire",
      });
      setLoading(false)
      return;
    }
    fetch(createEventAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: selectImage.data,
        idutente: userLogged.id,
        username: userLogged.nomeUtente,
        tipologiaevento: eventType,
        nomeevento: eventName,
        cittaclub: cityClub,
        club: club,
        nomeclub: clubName,
        indirizzo: address,
        citta: city,
        latitudine: latitude.toString(),
        longitudine: longitude.toString(),
        preferenzeDrink: drinkPreferences,
        data: eventDate,
        postiuomo: manSeats,
        prezzouomo: manPrice,
        postidonna: womanSeats,
        prezzodonna: womanPrice,
      }),
    }).then((res) => {
      if (res.status === 200) {
        //res.json().then((result) => console.log(result));
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Creazione evento",
          textBody:
            "Evento creato con successo, attendi l'approvazione degli amministratori",
        });
        setIsCheck(true);
        setSelectImage("");
        setEventName("");
        setAddress("");
        setDrinkPreferences("");
        setEventDate("");
        setManSeats("");
        setManPrice("");
        setWomanSeats("");
        setWomanPrice("");
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

  const getAllCities = async () => {
    fetch(getAllCitiesAddress, {
      method: "GET",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => {
          setCityClub(result["cities"][0].value);
          setCities(result["cities"]);
          getAllClubByCity(result["cities"][0].value);
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
      }
    });
  };

  const getAllClubByCity = async (clubId) => {
    fetch(getAllClubsByCityAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubid: clubId,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => {
          setClub(result["clubs"][0].value);
          setClubs(result["clubs"]);
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
      }
    });
  };

  useEffect(() => {
    getAllCities();
  }, []);

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <KeyBoardAvoidWrapper
          containerStyle={[styles.ph20, { marginBottom: 20 }]}
  >
          <EText
            numberOfLines={1}
            style={[styles.pr10, styles.mr10, styles.mt15, styles.mb10]}
            type={"B22"}
          >
            {strings.createEvent}
          </EText>

          {/*COVER*/}
          <TouchableOpacity
            onPress={onPressCoverImage}
            style={[styles.selfCenter, styles.mb20]}
          >
            {!!selectImage?.path ? (
              <Image
                source={{ uri: selectImage?.path }}
                style={localStyles.coverImage}
              />
            ) : (
              <View
                style={[
                  localStyles.coverImage,
                  {
                    borderColor: colors.dark
                      ? colors.grayScale8
                      : colors.grayScale3,
                  },
                ]}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={moderateScale(20)}
                  color={colors.grayScale5}
                  style={styles.mr5}
                />
                <EText type={"B14"} color={colors.grayScale5}>
                  {strings.uploadCoverImage}
                </EText>
              </View>
            )}
          </TouchableOpacity>

          {/*TIPOLOGIA EVENTO*/}
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
            data={EventType}
            maxHeight={moderateScale(180)}
            labelField="label"
            valueField="value"
            placeholder={strings.eventType}
            value={eventType}
            itemTextStyle={{
              color: colors.textColor,
              fontSize: moderateScale(16),
            }}
            onChange={onChangedEventType}
            selectedTextStyle={{
              color: colors.textColor,
            }}
            itemContainerStyle={{
              backgroundColor: colors.inputBg,
              borderRadius: 20,
            }}
            containerStyle={{
              borderRadius: 20,
              backgroundColor: colors.inputBg,
              borderColor: "transparent",
            }}
            activeColor={colors.inputBg}
          />

          {/*NOME EVENTO*/}
          <EInput
            placeHolder={strings.eventName}
            _value={eventName}
            autoCapitalize={"none"}
            toGetTextFieldValue={onChangedEventName}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
            ]}
            _maxLength={50}
          />

          {/* Mostra il dropdown dei club e delle città solo se eventType è "tavolo" */}
          {eventType === "tavolo" && (
            <>
              {/* Dropdown per la città */}
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
                data={cities}
                maxHeight={moderateScale(180)}
                labelField="label"
                valueField="value"
                placeholder={strings.city}
                value={cityClub}
                itemTextStyle={{
                  color: colors.textColor,
                  fontSize: moderateScale(16),
                }}
                onChange={onChangedCity}
                selectedTextStyle={{
                  color: colors.textColor,
                }}
                itemContainerStyle={{
                  backgroundColor: colors.inputBg,
                  borderRadius: 20,
                }}
                containerStyle={{
                  borderRadius: 20,
                  backgroundColor: colors.inputBg,
                  borderColor: "transparent",
                }}
                activeColor={colors.inputBg}
              />

              {/* Dropdown per il club */}
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
                data={clubs}
                maxHeight={moderateScale(180)}
                labelField="label"
                valueField="value"
                placeholder={strings.chooseClub}
                value={club}
                itemTextStyle={{
                  color: colors.textColor,
                  fontSize: moderateScale(16),
                }}
                onChange={onChangedClub}
                selectedTextStyle={{
                  color: colors.textColor,
                }}
                itemContainerStyle={{
                  backgroundColor: colors.inputBg,
                  borderRadius: 20,
                }}
                containerStyle={{
                  borderRadius: 20,
                  backgroundColor: colors.inputBg,
                  borderColor: "transparent",
                }}
                activeColor={colors.inputBg}
              />
            </>
          )}

          {/* Mostra il GooglePlacesAutocomplete solo se eventType non è "tavolo" */}
          {eventType !== "tavolo" && (
            <ScrollView keyboardShouldPersistTaps="handled" horizontal>
              <GooglePlacesAutocomplete
                placeholder="Città o indirizzo"
                enablePoweredByContainer={false}
                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                fetchDetails={true}
                onPress={handlePlaceSelect}
                query={{
                  key: process.env.GOOGLEAPIKEY,
                  language: "it",
                }}
                styles={{
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
                  },
                }}
                textInputProps={{
                  InputComp: EInput,
                  autoCapitalize: "none",
                  _maxLength: 20,
                  inputContainerStyle: [
                    { backgroundColor: colors.inputBg, width: getWidth(380) },
                    localStyles.inputContainerStyle,
                  ],
                }}
              />
            </ScrollView>
          )}

          {/*PREFERENZE SUI DRINK*/}
          <EInput
            placeHolder={strings.drinkPreferences}
            _value={drinkPreferences}
            autoCapitalize={"none"}
            toGetTextFieldValue={onChangedDrinkPreferences}
            inputContainerStyle={[
              { backgroundColor: colors.inputBg },
              localStyles.inputContainerStyle,
            ]}
            _maxLength={50}
          />

          {/*DATA*/}
          <TouchableOpacity
            onPress={onPressCalender}
            style={[
              localStyles.dobStyle,
              { borderColor: colors.bColor, backgroundColor: colors.inputBg },
            ]}
          >
            <EText
              type={"r16"}
              color={eventDate ? colors.textColor : colors.grayScale5}
            >
              {eventDate ? eventDate : strings.eventDate}
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
            minimumDate={new Date()}
            confirmTextIOS={strings.confirm}
            cancelTextIOS={strings.cancel}
          />

          <View style={localStyles.inputRow}>
            {/*POSTI UOMO*/}
            <EInput
              placeHolder={strings.manSeats}
              keyBoardType={"number-pad"}
              _value={manSeats}
              autoCapitalize={"none"}
              toGetTextFieldValue={onChangedManSeats}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg, marginRight: 10 },
                localStyles.inputContainerPriceAndSeatsStyle,
                localStyles.inputHalfWidth,
              ]}
              _maxLength={50}
            />

            {/*PREZZO UOMO*/}
            <EInput
              placeHolder={strings.manPrice}
              keyBoardType={"number-pad"}
              _value={manPrice}
              autoCapitalize={"none"}
              toGetTextFieldValue={onChangedManPrice}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerPriceAndSeatsStyle,
                localStyles.inputHalfWidth,
              ]}
              _maxLength={50}
            />
          </View>

          <View style={localStyles.inputRow}>
            {/*POSTI DONNA*/}
            <EInput
              placeHolder={strings.womanSeats}
              keyBoardType={"number-pad"}
              _value={womanSeats}
              autoCapitalize={"none"}
              toGetTextFieldValue={onChangedWomanSeats}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg, marginRight: 10 },
                localStyles.inputContainerPriceAndSeatsStyle,
                localStyles.inputHalfWidth,
              ]}
              _maxLength={50}
            />
            {/*PREZZO DONNA*/}
            <EInput
              placeHolder={strings.womanPrice}
              keyBoardType={"number-pad"}
              _value={womanPrice}
              autoCapitalize={"none"}
              toGetTextFieldValue={onChangedWomanPrice}
              inputContainerStyle={[
                { backgroundColor: colors.inputBg },
                localStyles.inputContainerPriceAndSeatsStyle,
                localStyles.inputHalfWidth,
              ]}
              _maxLength={50}
            />
          </View>
        </KeyBoardAvoidWrapper>

        {/*COVER*/}
        <CoverImage
          onPressCamera={onPressCamera}
          onPressGallery={onPressGallery}
          SheetRef={CoverImageSheetRef}
        />

        {/*TERMINI E CONDIZIONI*/}
        <TouchableOpacity
          onPress={() => setIsCheck(!isCheck)}
          style={localStyles.checkboxContainer}
        >
          <Ionicons
            name={isCheck ? "square-outline" : "checkbox"}
            size={moderateScale(22)}
            color={colors.primary5}
          />
          <EText type={"s13"} style={styles.mh10}>
            {strings.iAccept}
            <EText type={"s13"} color={colors.primary5}>
              {strings.termsAndConditions}
            </EText>
          </EText>
        </TouchableOpacity>

        {/*BOTTONE*/}
        <EButton
          type={"S16"}
          title={strings.continue}
          color={colors.white}
          onPress={onPressContinue}
          containerStyle={localStyles.continueBtnStyle}
          loading={loading}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
};

export default CreateTab;

const localStyles = StyleSheet.create({
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
    ...styles.mv15,
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
  checkboxContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.ph20,
    ...styles.mb10,
    marginTop: -12,
  },

  coverImage: {
    height: moderateScale(200),
    width: moderateScale(300),
    borderRadius: moderateScale(20),

    borderWidth: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  inputHalfWidth: {
    width: getWidth(185), // Larghezza di circa metà dello spazio disponibile
  },
  inputRow: {
    flexDirection: "row",
  },
  inputContainerPriceAndSeatsStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
});
