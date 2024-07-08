// Library import
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

// Local import
import EHeader from "../../components/common/EHeader";
import strings from "../../i18n/strings";
import { styles } from "../../themes";
import { getHeight, getWidth, moderateScale } from "../../common/constants";
import EButton from "../../components/common/EButton";
import KeyBoardAvoidWrapper from "../../components/common/KeyBoardAvoidWrapper";
import ESafeAreaView from "../../components/common/ESafeAreaView";
import { StackNav } from "../../navigation/NavigationKeys";
import { isEmpty } from "../../utils/validators";
import EText from "../../components/common/EText";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { address } from "../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { UserLoggedContext } from "../../context/UserLoggedContext";

const updateUserLocationAddress = `http://${address}:8080/update-user-address`;

export default function Location({ navigation }) {
  const colors = useSelector((state) => state.theme.theme);

  const [latitude, setLatitudine] = useState(45.465454);
  const [longitude, setLongitudine] = useState(9.186516);
  const [indirizzo, setIndirizzo] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const mapViewRef = useRef(null);

  const { setUserLogged } = useContext(UserLoggedContext);

  //Informazioni utente
  const onPressContinue = async () => {
    setLoading(true);
    if (isEmpty(address)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Devi inserire un indirizzo",
      });
      setLoading(false);
      return;
    }
    fetch(updateUserLocationAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indirizzo: indirizzo,
        citta: city,
        stato: state,
        latitudine: latitude.toString(),
        longitudine: longitude.toString(),
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setUserLogged(result["user"]));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: StackNav.TabBar,
              params: {
                //email: email,
              },
            },
          ],
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

  useEffect(() => {
    mapViewRef.current?.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021,
    });
  }, [latitude, longitude]);

  const ref = useRef(null);


  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EText type={"b20"} style={localStyles.textLocation}>
          {strings.setLocation}
        </EText>

        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
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
                height: 400,
                width: 400,
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

          <MapView
            ref={mapViewRef}
            style={localStyles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0021,
            }}
          >
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title={"prova"}
              description={"prova"}
            />
          </MapView>
        </View>

        <View
          style={[
            localStyles.bottomContainer,
            { backgroundColor: colors.backgroundColor },
          ]}
        >
          <EButton
            title={strings.continue}
            type={"S16"}
            color={colors.white}
            containerStyle={styles.mv10}
            onPress={onPressContinue}
            loading={loading}
          />
        </View>
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
}

const localStyles = StyleSheet.create({
  mapImage: {
    width: "100%",
    height: "100%",
  },
  bottomContainer: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    ...styles.ph20,
  },
  titleContainer: {
    ...styles.p20,
  },
  checkboxContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph10,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  indicatorStyle: {
    width: moderateScale(60),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    ...styles.mt10,
    ...styles.selfCenter,
  },
  textLocation: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
