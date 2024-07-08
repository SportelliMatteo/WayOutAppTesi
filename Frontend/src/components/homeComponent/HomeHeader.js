import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, { useContext, useEffect } from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
// custom imports
import {styles} from '../../themes';
import {NotificationDark, NotificationLight, ProfileDark, ProfileLight} from '../../assets/svgs';
import EText from '../common/EText';
import {moderateScale} from '../../common/constants';
import { StackNav } from '../../navigation/NavigationKeys';
import { UserLoggedContext } from '../../context/UserLoggedContext';

function HomeHeader() {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const onPressNotification = () => navigation.navigate(StackNav.Notification)
  const onPressProfile = () => navigation.navigate(StackNav.ProfileTab)

  const {userLogged} = useContext(UserLoggedContext)

  return (
    <View style={localStyles.headerContainer}>
      <Image
        source={{
          uri: userLogged.profileImages && userLogged.profileImages.length > 0 ? userLogged.profileImages[0] : 'https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620',
        }}
        style={localStyles.userImageStyle}
      />
      <View style={localStyles.textContainer}>
        <EText type="B20" numberOfLines={1} color={colors.primaryTextColor}>
          {userLogged.nome} {userLogged.cognome}
        </EText>
      </View>

      {/*<TouchableOpacity
        onPress={onPressProfile}
        style={[
          localStyles.notificationContainer,
          {borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3},
        ]}>
        {colors.dark ? <ProfileLight /> : <ProfileDark />}
      </TouchableOpacity>*/}
    </View>
  );
}

export default React.memo(HomeHeader);

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.flex,
    ...styles.mt15,
  },
  userImageStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  textContainer: {
    ...styles.mh10,
    ...styles.flex,
  },
  notificationContainer: {
    ...styles.center,
    ...styles.ph10,
    ...styles.pv10,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(26),
  },
});
