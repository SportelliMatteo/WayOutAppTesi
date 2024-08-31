import {
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";

// Custom Imports
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import {
  deviceHeight,
  getHeight,
  moderateScale,
} from "../../../common/constants";
import EHeader from "../../../components/common/EHeader";
import strings from "../../../i18n/strings";
import EText from "../../../components/common/EText";
import {
  CalenderBg,
  LocationDark,
  LocationIcon,
  PeopleLight,
  SendDark,
  TicketLight,
} from "../../../assets/svgs";
import { commonColor, styles } from "../../../themes";
import { reviewsData } from "../../../api/constant";
import EDivider from "../../../components/common/EDivider";
import EButton from "../../../components/common/EButton";
import UserDetailComponent from "../../../components/UserDetailComponent";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { StackNav } from "../../../navigation/NavigationKeys";
import MapView, { Marker } from "react-native-maps";
import { useStripe } from "@stripe/stripe-react-native";
import { address } from "../../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import uuid from "react-native-uuid";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const paymentAddress = `http://${address}:8080/payment`;
const updatePostiEventoAddress = `http://${address}:8080/update-posti-event`;

export default function EventDetail({ navigation, route }) {
  const { item } = route.params;
  const colors = useSelector((state) => state.theme.theme);
  const mapViewRef = useRef(null);
  const { userLogged } = useContext(UserLoggedContext);

  const onPressGallery = () => navigation.navigate(StackNav.GalleryPreEvent);

  //Stripe
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);

  const [manSeat, setManSeat] = useState(item.manSeat);
  const [womanSeat, setWomanSeat] = useState(item.womanSeat);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(paymentAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth().currentUser.getIdToken(),
      },
      body: JSON.stringify({
        evento: item.id,
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer, publishableKey } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "WayOut S.R.L.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        returnURL: "https://www.google.it",
        locale: "IT",
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: "Jane Doe",
        },
      });
      if (!error) {
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody:
          `Posti ${userLogged.sesso} terminati oppure errore durante l'inizializzazione del pagamento`,
      });
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { error } = await presentPaymentSheet();

      const currentUser = auth().currentUser;

      if (error) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Pagamento non effettuato o posti esauriti",
        });
      } else {
        const user = {
          _id: "amministratore",
          avatar: "https://files.catbox.moe/kop4dm.png",
          name: "WAYOUT",
        };
        const usermsg = {
          _id: uuid.v4(),
          createdAt: new Date(),
          sentBy: "amministratore",
          text: "Benvenuto " + userLogged.nome + " " + userLogged.cognome + ". Sei tu il creatore dell'evento e quindi il referente per tutti gli altri partecipanti! 🍾🕺🏻",
          user: user,
        };

        const existingChatQuery = await firestore()
          .collection("chats")
          .where("eventId", "==", item.id)
          .limit(1)
          .get();

        
        if (existingChatQuery.empty) {  
          const chatid = uuid.v4();
          const chatRef = firestore().collection("chats").doc(chatid);

          chatRef
            .set({
              eventId: item.id,
              eventName: item.eventName,
              image: item.eventsImages[0],
              date: item.date,
              location: item.eventType == "Tavolo" ? item.club.clubName : item.address, 
            })
            .then(() => {
              return chatRef.collection("messages").add({ ...usermsg });
            });

            firestore()
            .collection("users")
            .doc(currentUser.uid)
            .update({
              chats: firebase.firestore.FieldValue.arrayUnion(chatid),
            });
        }else{
          const exisistingChatId = existingChatQuery.docs[0].id; 

          firestore()
          .collection("users")
          .doc(currentUser.uid)
          .update({
            chats: firebase.firestore.FieldValue.arrayUnion(exisistingChatId),
          });
        }

        fetch(updatePostiEventoAddress, {
          method: "POST",
          headers: {
            Authorization: await auth().currentUser.getIdToken(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idEvento: item.id,
            sesso: item.gender
          }),
        }).then((res) => {
          if (res.status === 200) {
            if (userLogged.sesso === "uomo") {
              setManSeat(manSeat - 1);
            } else {
              setWomanSeat(womanSeat - 1);
            }
            console.log("Posti diminuiti")
          } else {
            console.log("errore posti diminuiti")
          }
        });


        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Conferma",
          textBody: "Pagamento effettuato con successo",
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Errore",
        textBody: "Si è verificato un errore durante l'apertura del pagamento",
      });
    } finally {
      setLoading(false); // Assicura che lo spinner venga nascosto indipendentemente dall'esito del pagamento
    }
  };

  useEffect(() => {
    initializePaymentSheet();
    console.log(item)
  }, []);

  /*const onPressBookEvent = () => {
    navigation.navigate(StackNav.BookSeat)


  };*/

  const openMapsApp = () => {
    const latitude =
      item.club.clubName === "evento_privato"
        ? item.latitude
        : item.club.latitude;
    const longitude =
      item.club.clubName === "evento_privato"
        ? item.longitude
        : item.club.longitude;
    const label =
      item.club.clubName === "evento_privato"
        ? "Evento privato"
        : item.club.clubName;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&ll=${latitude},${longitude}&q=${label}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url);
  };

  const onPressGoing = () => navigation.navigate(StackNav.GoingUser);

  const RightIcon = useMemo(() => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity style={styles.pl10}>
          <SendDark />
        </TouchableOpacity>
      </View>
    );
  }, []);

  const renderUserItem = ({ item, index }) => {
    return (
      <View
        style={{
          zIndex: 10,
          left: moderateScale(index * -10),
        }}
      >
        <Image
          source={{
            uri: item?.image,
          }}
          style={localStyles.userImageStyle}
        />
      </View>
    );
  };

  const RenderHeaderItem = () => {
    return (
      <View>
        <ImageBackground
          source={{
            uri:
              item.eventsImages && item.eventsImages.length > 0
                ? item.eventsImages[0]
                : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620",
          }}
          style={localStyles.imageStyle}
        >
          <EHeader />
        </ImageBackground>
        <View style={[styles.ph20, {marginBottom: 20, marginTop: 10}]}>
          <EText type={"b28"} style={styles.mv10}>
            {item.eventName}
          </EText>
        </View>
      </View>
    );
  };

  const RenderFooterItem = () => {
    return (
      <View style={styles.ph20}>
        <View style={{ flexDirection: "row" }}>
          <View>
            <CalenderBg style={localStyles.renderContainer} />
          </View>
          <View style={localStyles.textStyle}>
            <EText numberOfLines={1} type={"b18"}>
              {"Sabato, " + item.date}
            </EText>
            
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View>
            <LocationDark style={localStyles.renderContainer} />
          </View>
          <View style={localStyles.textStyle}>
            <EText numberOfLines={1} type={"b18"}>
              {item.club.clubName === "evento_privato"
                ? item.eventType
                : item.club.clubName}
            </EText>

            <EText
              type={"m14"}
              color={colors.textColor2}
              numberOfLines={1}
              style={styles.mt5}
            >
              {item.club.clubName === "evento_privato"
                ? item.address
                : item.club.address}
            </EText>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ marginRight: 10 }}>
            <TicketLight style={localStyles.renderContainer} />
          </View>
          <View style={[{ marginRight: 30, justifyContent: "center" }]}>
            <EText numberOfLines={1} type={"b18"}>
              {"€"} {item.manPrice}
            </EText>

            <EText
              type={"m14"}
              color={colors.textColor2}
              numberOfLines={1}
              style={styles.mt5}
            >
              {strings.manPrice}
            </EText>
          </View>

          <View style={{ marginRight: 10 }}>
            <PeopleLight style={localStyles.renderContainer} />
          </View>
          <View style={{ justifyContent: "center" }}>
            <EText numberOfLines={1} type={"b18"}>
              {manSeat}
            </EText>

            <EText
              type={"m14"}
              color={colors.textColor2}
              numberOfLines={1}
              style={styles.mt5}
            >
              {strings.manSeats}
            </EText>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ marginRight: 10 }}>
            <TicketLight style={localStyles.renderContainer} />
          </View>
          <View style={[{ marginRight: 25, justifyContent: "center" }]}>
            <EText numberOfLines={1} type={"b18"}>
              {"€"} {item.womanPrice}
            </EText>

            <EText
              type={"m14"}
              color={colors.textColor2}
              numberOfLines={1}
              style={styles.mt5}
            >
              {strings.womanPrice}
            </EText>
          </View>

          <View style={{ marginRight: 10 }}>
            <PeopleLight style={localStyles.renderContainer} />
          </View>
          <View style={{ justifyContent: "center" }}>
            <EText numberOfLines={1} type={"b18"}>
              {womanSeat}
            </EText>

            <EText
              type={"m14"}
              color={colors.textColor2}
              numberOfLines={1}
              style={styles.mt5}
            >
              {strings.womanSeats}
            </EText>
          </View>
        </View>

        <EDivider style={styles.mt25} />
        <UserDetailComponent
          userName={item.user.nome + " " + item.user.cognome}
          userImage={
            item.profileImages && item.profileImages.length > 0
              ? item.profileImages[0]
              : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620"
          }
          userDescription={"Organizzatore"}
          string1={strings.followed}
          string2={strings.follow}
        />
        <EText type={"b18"} style={styles.mt20}>
          {strings.aboutEvent}
        </EText>
        <EText type={"r14"} style={styles.mt10}>
          {item.description}
        </EText>
        <EText type={"b18"} style={styles.mt20}>
          {strings.drinkPreferences}
        </EText>
        <EText type={"r14"} style={styles.mt10}>
          {item.drinkPreference}
        </EText>
        <EText type={"b18"} style={styles.mt20}>
          {strings.location}
        </EText>
        <View style={[styles.flexRow, styles.mt10]}>
          <LocationIcon />
          <EText type={"r14"} style={styles.ml5}>
            {item.club.clubName === "evento_privato"
              ? item.address
              : item.club.clubName + ", " + item.club.address}
          </EText>
        </View>
        <TouchableOpacity onPress={openMapsApp}>
          <MapView
            ref={mapViewRef}
            style={localStyles.map}
            initialRegion={{
              latitude:
                item.club.clubName === "evento_privato"
                  ? parseFloat(item.latitude)
                  : parseFloat(item.club.latitude),
              longitude:
                item.club.clubName === "evento_privato"
                  ? parseFloat(item.longitude)
                  : parseFloat(item.club.longitude),
              latitudeDelta: 0.0022,
              longitudeDelta: 0.0021,
            }}
          >
            <Marker
              coordinate={{
                latitude:
                  item.club.clubName === "evento_privato"
                    ? parseFloat(item.latitude)
                    : parseFloat(item.club.latitude),
                longitude:
                  item.club.clubName === "evento_privato"
                    ? parseFloat(item.longitude)
                    : parseFloat(item.club.longitude),
              }}
              title={
                item.club.clubName === "evento_privato"
                  ? "Evento privato"
                  : item.club.clubName
              }
              description={
                item.club.clubName === "evento_privato"
                  ? item.address
                  : item.club.address
              }
            />
          </MapView>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <FlashList
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={RenderHeaderItem}
          ListFooterComponent={RenderFooterItem}
          estimatedItemSize={10}
        />
        <View style={localStyles.bottomContainer}>
          <EButton
            title={strings.bookEvent}
            type={"S16"}
            onPress={openPaymentSheet}
            disabled={loading}
            loading={loading}
          />
        </View>
      </ESafeAreaView>
    </AlertNotificationRoot>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: deviceHeight / 2 - moderateScale(80),
    resizeMode: "cover",
  },
  musicContainer: {
    width: moderateScale(60),
    height: moderateScale(26),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary5,
    ...styles.center,
  },
  imageContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  userImageStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    resizeMode: "cover",
  },
  locationContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  root: {
    ...styles.ph20,
    ...styles.mt20,
  },
  renderContainer: {
    ...styles.flexRow,
    ...styles.itemsStart,
    borderRadius: moderateScale(10),
  },
  textStyle: {
    ...styles.mh10,
    ...styles.flex,
    ...styles.justifyCenter,
  },
  headerContainer: {
    ...styles.ml20,
    ...styles.mb15,
  },
  newContainer: {
    ...styles.center,
    ...styles.p5,
    borderRadius: moderateScale(5),
    backgroundColor: commonColor.primary5,
  },
  btnContainer: {
    height: moderateScale(35),
    width: "90%",
    borderRadius: moderateScale(17),
    ...styles.mt10,
  },
  mapImgStyle: {
    width: "100%",
    height: moderateScale(175),
    resizeMode: "cover",
    borderRadius: moderateScale(8),
    ...styles.mv20,
  },
  bottomContainer: {
    ...styles.ph20,
    ...styles.pv10,
  },

  map: {
    marginTop: 10,
    width: "100%",
    height: getHeight(200),
    borderRadius: 20,
  },
});
