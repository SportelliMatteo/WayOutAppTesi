// Library import
import {StyleSheet} from 'react-native';
import React, {useState} from 'react';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {FlashList} from '@shopify/flash-list';
import NotificationItem from '../../../components/profileComponent/NotificationItem';

export default NotificationSetting = () => {
  const [isEnabled, setIsEnabled] = useState({
    generalNotification: false,
    sound: false,
    vibrate: false,
    specialOffers: false,
    promoAndDiscount: false,
    payment: false,
    cashBack: false,
    appUpdate: false,
    newServiceAvailable: false,
    newTipsAvailable: false,
    recommendations: false,
  });

  const NotificationData = [
    {
      title: strings.enableSoundVibrate,
      value: isEnabled.generalNotification,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          generalNotification: isEnabled.generalNotification ? false : true,
        }),
    },
    {
      title: strings.newEvents,
      value: isEnabled.sound,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          sound: isEnabled.sound ? false : true,
        }),
    },
    {
      title: strings.specialOffers,
      value: isEnabled.specialOffers,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          specialOffers: isEnabled.specialOffers ? false : true,
        }),
    },
    {
      title: strings.payment,
      value: isEnabled.payment,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          payment: isEnabled.payment ? false : true,
        }),
    },
    {
      title: strings.recommendations,
      value: isEnabled.recommendations,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          recommendations: isEnabled.recommendations ? false : true,
        }),
    },
    {
      title: strings.appUpdate,
      value: isEnabled.appUpdate,
      onPress: () =>
        setIsEnabled({
          ...isEnabled,
          appUpdate: isEnabled.appUpdate ? false : true,
        }),
    },
  ];

  return (
    <ESafeAreaView>
      <EHeader title={strings.notification} />
      <FlashList
        data={NotificationData}
        renderItem={({item, index}) => (
          <NotificationItem item={item} key={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        contentContainerStyle={localStyles.root}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </ESafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph25,
    ...styles.mt20,
  },
});
