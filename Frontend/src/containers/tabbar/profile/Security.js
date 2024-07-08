// Library import
import {
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EText from '../../../components/common/EText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import EButton from '../../../components/common/EButton';
import {StackNav} from '../../../navigation/NavigationKeys';

export default Security = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [isEnabled, setIsEnabled] = React.useState({
    rememberMe: false,
    faceId: false,
    biometricId: false,
  });

  const SecurityData = [
    
  ];

  const onPressChangePassword = () =>
    navigation.navigate(StackNav.CreateNewPassword);

  const RenderData = data => {
    return (
      <TouchableOpacity style={localStyles.settingsContainer}>
        <EText type="s18">{data.item.title}</EText>
        <View style={localStyles.rightContainer}>
          {!!data?.item?.rightIcon ? (
            <Switch
              trackColor={{
                false: colors.grayScale3,
                true: colors.primary5,
              }}
              thumbColor={colors.white}
              onValueChange={data?.item?.toggleSwitch}
              value={data?.item?.value}
            />
          ) : (
            <Ionicons
              name="chevron-forward-outline"
              size={moderateScale(20)}
              color={colors.white}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.security} />
      <View style={styles.ph20}>
        <FlatList
          data={SecurityData}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <RenderData item={item} />}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
        <EButton
          title={strings.changePassword}
          type={'S16'}
          color={colors.white}
          containerStyle={localStyles.btnContainer}
          onPress={onPressChangePassword}
        />
      </View>
    </ESafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
  btnContainer: {
    ...styles.center,
    width: '100%',
    alignSelf: 'center',
    ...styles.mt25,
  },
});
