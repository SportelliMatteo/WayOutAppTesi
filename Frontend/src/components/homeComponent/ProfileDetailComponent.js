import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// Custom Imports
import EText from "../common/EText";
import { styles } from "../../themes";
import { StackNav } from "../../navigation/NavigationKeys";
import strings from "../../i18n/strings";
import { moderateScale } from "../../common/constants";
import EDivider from "../common/EDivider";
import { UserLoggedContext } from "../../context/UserLoggedContext";
import EButton from "../common/EButton";

export default function ProfileDetailComponent(props) {
  const {
    isEdit = false,
    userName,
    imgUrl,
    eventsActive,
    eventsUnActive,
    followers,
    following,
  } = props;
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();

  const { userLogged } = useContext(UserLoggedContext);

  const handleEventActive = () =>
    navigation.navigate(StackNav.MyEvents, { title: strings.eventsActive });

  const handleEventUnActive = () =>
    navigation.navigate(StackNav.MyEvents, { title: strings.eventsUnActive });

  const InfoItem = ({ item, title }) => {
    return (
      <View style={localStyles.infoSubContainer}>
        <EText type="b24">{item}</EText>
        <EText type="r18">{title}</EText>
      </View>
    );
  };

  return (
    <View>
      <View style={[styles.selfCenter, styles.mb20]}>
        <Image
          source={{
            uri:
              userLogged.profileImages && userLogged.profileImages.length > 0
                ? userLogged.profileImages[0]
                : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620",
          }}
          style={localStyles.userImage}
        />
      </View>
      <View style={styles.mb20}>
        <EText type="b24" align={"center"}>
          {userName}
        </EText>
      </View>
      <EDivider />
      <View style={localStyles.infoContainer}>
        <TouchableOpacity onPress={handleEventActive}>
          <InfoItem title={strings.eventsActive} item={eventsActive}/>
        </TouchableOpacity>
        <View
          style={[
            localStyles.divider,
            {
              backgroundColor: colors.dark
                ? colors.grayScale8
                : colors.grayScale3,
            },
          ]}
        />
        <TouchableOpacity onPress={handleEventUnActive}>
          <InfoItem title={strings.eventsUnActive} item={eventsUnActive}/>
        </TouchableOpacity>
      </View>
      <EDivider />
    </View>
  );
}

const localStyles = StyleSheet.create({
  infoSubContainer: {
    ...styles.center,
  },
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
  infoContainer: {
    ...styles.rowSpaceAround,
    ...styles.mv10,
  },
  divider: {
    width: moderateScale(1),
    height: moderateScale(45),
    ...styles.mv10,
  },
});
