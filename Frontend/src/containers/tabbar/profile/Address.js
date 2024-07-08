// Library import
import {StyleSheet, Switch, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import EText from '../../../components/common/EText';
import {
  Apple_Dark,
  Apple_Light,
  Facebook_Icon,
  Google_Icon,
} from '../../../assets/svgs';

export default function Address({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const [isEnabled, setIsEnabled] = React.useState({
    google: false,
    apple: false,
    facebook: false,
  });

  const SecurityData = [
    {
      title: strings.google,
      rightIcon: true,
      value: isEnabled.google,
      icon: <Google_Icon />,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          google: isEnabled.google ? false : true,
        }),
    },
    {
      title: strings.apple,
      rightIcon: true,
      icon: colors.dark === 'dark' ? <Apple_Light /> : <Apple_Dark />,
      value: isEnabled.apple,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          apple: isEnabled.apple ? false : true,
        }),
    },
    {
      title: strings.facebook,
      rightIcon: true,
      value: isEnabled.facebook,
      icon: <Facebook_Icon />,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          facebook: isEnabled.facebook ? false : true,
        }),
    },
  ];

  const RenderData = data => {
    return (
      <TouchableOpacity style={localStyles.settingsContainer}>
        <View style={[styles.flexRow, styles.itemsCenter]}>
          {data?.item?.icon}
          <EText style={styles.ml10} type="s18">
            {data.item.title}
          </EText>
        </View>
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
      <EHeader title={strings.linkedAccounts} />
      <FlashList
        data={SecurityData}
        renderItem={RenderData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        bounces={false}
        estimatedItemSize={20}
        contentContainerStyle={styles.ph20}
      />
    </ESafeAreaView>
  );
}

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
