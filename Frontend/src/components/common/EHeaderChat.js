import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

// Custom Imports
import { styles } from "../../themes";
import EText from "./EText";
import { moderateScale } from "../../common/constants";

const EHeader = (props) => {
  const {
    title,
    onPressBack,
    rightIcon,
    rightImage,
    isHideBack,
    isLeftIcon,
    showAdditionalText,
    additionalText,
    imageEvent,
  } = props;
  const navigation = useNavigation();
  const colors = useSelector((state) => state.theme.theme);

  const goBack = () => navigation.goBack();
  return (
    <View style={[localStyles.container, !!isHideBack && styles.pr10]}>
      <View style={[styles.rowStart, styles.flex]}>
        {!isHideBack && (
          <TouchableOpacity style={styles.pr10} onPress={onPressBack || goBack}>
            <Ionicons
              name="arrow-back-outline"
              size={moderateScale(26)}
              color={colors.textColor}
            />
          </TouchableOpacity>
        )}
        {!!rightImage && (
          <TouchableOpacity onPress={props.onRightImagePress}>
            <Image
              source={{
                uri: imageEvent,
              }}
              style={{ width: 40, height: 40, borderRadius: moderateScale(50),marginRight:10 }}
            />
          </TouchableOpacity>
        )}
        {!!isLeftIcon && isLeftIcon}
        <View>
          <EText
            numberOfLines={1}
            style={[styles.pr10, styles.mr10, localStyles.groupName]}
          >
            {title}
          </EText>
        </View>
      </View>
      {!rightImage && !!rightIcon && rightIcon}
    </View>
  );
};

export default memo(EHeader);

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    height:50,
    ...styles.center,
  },
  groupName:{
    fontSize: 17,
    fontWeight: "bold"
  },
  partecipants:{
    fontSize: 11,
  }
});
