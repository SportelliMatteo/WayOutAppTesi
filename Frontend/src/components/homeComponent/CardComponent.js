import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Custom Imports
import EText from "../common/EText";
import { commonColor, styles } from "../../themes";
import { deviceWidth, getHeight, moderateScale } from "../../common/constants";
import images from "../../assets/images";
import { FavouriteActive, HeartIcon, LocationIcon } from "../../assets/svgs";
import { useNavigation } from "@react-navigation/native";
import { StackNav } from "../../navigation/NavigationKeys";

export default function CardComponent({ item }) {
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();

  const onPressDetail = () =>{
    navigation.navigate(StackNav.EventDetail, { item });
}
  return (
    <TouchableOpacity
      onPress={onPressDetail}
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
        imageStyle={{borderRadius: moderateScale(16)}}>
          <View style={localStyles.freeContainer}>
            <EText type={'B12'} color={colors.white} align={'center'}>
              {item.club.clubName === "evento_privato" ? "Evento privato" : "Tavolo"}
            </EText>
          </View>
      </ImageBackground>
      <View style={localStyles.headerContainer}>
        <Image
          source={{
            uri:
              item.profileImages && item.profileImages.length > 0
                ? item.profileImages[0]
                : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620",
          }}
          style={localStyles.userImageStyle}
        />

        <View style={localStyles.textContainer}>
          <EText type="B14" numberOfLines={1} color={colors.primaryTextColor}>
            {item.user.nome} {item.user.cognome}
          </EText>
        </View>
      </View>
      <View style={[styles.flexRow, styles.itemsCenter, {marginBottom:6, marginTop:10}]}>
        <EText type={"b18"} numberOfLines={1} >
          {item.eventName + " - "}
        </EText>
        <EText type={"b16"} numberOfLines={1}>
          {item.date}
        </EText>
      </View>
      <View style={[styles.rowSpaceBetween, styles.mt5]}>
        <View style={[styles.flexRow, styles.itemsCenter, styles.flex]}>
          <LocationIcon />
          <EText
            type={"S14"}
            color={colors.textColor2}
            numberOfLines={1}
            style={styles.mh5}
          >
            {item.eventType === "Tavolo" ? item.club.clubName : item.address}
          </EText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.p15,
    ...styles.mv15,
    ...styles.mh10,
    ...styles.flex,
    ...styles.justifyCenter,
    ...styles.shadowStyle,
    borderRadius: moderateScale(18),
  },
  imageStyle: {
    width: '100%',
    height: getHeight(190),
    borderRadius: 60 ,
  },
  textStyle: {
    ...styles.mt10,
    ...styles.flex,
  },
  userImageStyle: {
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(25),
    marginRight: 10,
  },

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  freeContainer: {
    height: moderateScale(22),
    width: moderateScale(90),
    borderRadius: moderateScale(8),
    ...styles.center,
    ...styles.selfEnd,
    backgroundColor: commonColor.primary5,
    right: moderateScale(10),
    top: moderateScale(10),
  },
});
