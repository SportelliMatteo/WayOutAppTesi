import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";

// Custom Imports
import EText from "../common/EText";
import { styles } from "../../themes";
import { moderateScale } from "../../common/constants";
import { StackNav } from "../../navigation/NavigationKeys";
import { useNavigation } from "@react-navigation/native";

const TicketCardComponent = (props) => {
  const {
    item,
    isCompleted = true,
    title,
    textColor,
    btnText,
    onPressBtn,
  } = props;
  const colors = useSelector((state) => state.theme.theme);
  const navigation = useNavigation();

  const handleChat = () =>
    navigation.navigate(StackNav.CustomerService);

  return (
    <View
      style={[
        localStyles.root,
        { backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1 },
      ]}
    >
      <TouchableOpacity onPress={handleChat}>
        <View style={localStyles.innerContainer}>
          <ImageBackground
            source={{ uri: item?.image }}
            style={localStyles.imageStyle}
            imageStyle={{ borderRadius: moderateScale(25) }}
          ></ImageBackground>
          <View style={localStyles.rightContainer}>
            <EText type={"b16"} numberOfLines={1} style={localStyles.textStyle}>
              {item?.title}
            </EText>
            <View style={localStyles.textAndTime}>
              <EText
                type={"S14"}
                numberOfLines={1}
                style={localStyles.textStyle}
              >
                {item?.time}
              </EText>
              <EText type={"S14"} numberOfLines={1} style={{ marginLeft: 15 }}>
                14.30
              </EText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(TicketCardComponent);

const localStyles = StyleSheet.create({
  root: {
    ...styles.p10,
    ...styles.shadowStyle,
    width: "100%",
    ...styles.mt15,
    borderRadius: moderateScale(16),
  },
  innerContainer: {
    ...styles.justifyCenter,
    ...styles.flexRow,
  },
  imageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: "cover",
  },
  textStyle: {
    ...styles.flex,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.ml10,
  },
  textAndTime: {
    ...styles.flexRow,
    justifyContent: "space-between",
  },
});
