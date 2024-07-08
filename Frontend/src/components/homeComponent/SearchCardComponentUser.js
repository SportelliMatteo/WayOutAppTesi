import {
  Alert,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";

// Custom Imports
import EText from "../common/EText";
import { commonColor, styles } from "../../themes";
import { moderateScale } from "../../common/constants";
import {
  FavouriteActive,
  HeartIcon,
  LocationIcon,
  Trash,
} from "../../assets/svgs";
import { useNavigation } from "@react-navigation/native";
import { StackNav } from "../../navigation/NavigationKeys";
import { address } from "../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const deleteEventAddress = `http://${address}:8080/delete-event-request`;

const SearchCardComponentUser = ({ item }) => {
  const colors = useSelector((state) => state.theme.theme);

  const deleteEvent = async () => {
    fetch(deleteEventAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idEvento: item.id,
      }),
    }).then((res) => {
      if (res.status === 200) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Conferma",
          textBody: "Richiesta di eliminazione inviata.",
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

  return (
    
      <View
        style={[
          localStyles.root,
          { backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1 },
        ]}
      >
        <ImageBackground
          source={{
            uri:
              item.eventsImages && item.eventsImages.length > 0
                ? item.eventsImages[0]
                : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620",
          }}
          style={localStyles.imageStyle}
          imageStyle={{ borderRadius: moderateScale(16) }}
        >
          <View style={localStyles.freeContainer}>
            <EText type={"S12"} color={colors.white} align={"center"}>
              {item.eventType}
            </EText>
          </View>
        </ImageBackground>
        <View style={localStyles.rightContainer}>
          <EText type={"b16"} numberOfLines={1} style={localStyles.textStyle}>
            {item.eventName}
          </EText>
          <EText
            type={"S14"}
            numberOfLines={1}
            color={colors.primary5}
            style={localStyles.textStyle}
          >
            {item.date}
          </EText>
          <View style={localStyles.locationContainer}>
            <View style={localStyles.locationSubContainer}>
              <LocationIcon
                width={moderateScale(16)}
                height={moderateScale(16)}
              />
              <EText
                type={"S12"}
                color={colors.textColor2}
                numberOfLines={1}
                style={styles.mh5}
              >
                {item.eventType === "Tavolo"
                  ? item.club.clubName
                  : item.address}
              </EText>
            </View>

            <TouchableOpacity style={styles.ml15} onPress={deleteEvent}>
              <Trash width={moderateScale(18)} height={moderateScale(18)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    
  );
};

export default memo(SearchCardComponentUser);

const localStyles = StyleSheet.create({
  root: {
    ...styles.p10,
    ...styles.shadowStyle,
    ...styles.justifyCenter,
    ...styles.flexRow,
    width: "100%",
    ...styles.mt15,
    borderRadius: moderateScale(16),
  },
  imageStyle: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: "cover",
  },
  textStyle: {
    ...styles.mt10,
    ...styles.flex,
  },
  locationSubContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
  locationContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt10,
    ...styles.mb5,
  },
  freeContainer: {
    height: moderateScale(22),
    width: moderateScale(90),
    borderRadius: moderateScale(8),
    ...styles.selfEnd,
    ...styles.center,
    backgroundColor: commonColor.primary5,
    right: moderateScale(5),
    top: moderateScale(10),
  },
  rightContainer: {
    ...styles.flex,
    ...styles.ml10,
  },
});
