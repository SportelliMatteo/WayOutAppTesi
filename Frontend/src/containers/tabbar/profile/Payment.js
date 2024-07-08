// Library import
import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {moderateScale} from '../../../common/constants';
import {styles} from '../../../themes';
import EText from '../../../components/common/EText';
import {
  Apple_Dark,
  Apple_Light,
  Facebook_Icon,
  Google_Icon,
  Wallet_Dark,
  Wallet_Light,
} from '../../../assets/svgs';
import EButton from '../../../components/common/EButton';
import {StackNav} from '../../../navigation/NavigationKeys';
import PaymentSelect from '../../../components/cartComponent/PaymentSelect';
import {FlashList} from '@shopify/flash-list';

export default Payment = ({navigation, route}) => {
  const colors = useSelector(state => state.theme.theme);
  const title = route.params?.title;
  const desc = route.params?.desc;
  const isWallet = route.params?.isWallet;
  const [isSelected, setIsSelected] = useState('');
  const [extraData, setExtraData] = useState(false);

  useEffect(() => {
    setExtraData(!extraData);
  }, [isSelected]);

  const paymentData = [
    {
      title: strings.wallet,
      icon: [colors.dark ? <Wallet_Dark /> : <Wallet_Light />],
    },
    {
      title: strings.paypal,
      icon: <Facebook_Icon />,
    },
    {
      title: strings.applePay,
      icon: [colors.dark ? <Apple_Light /> : <Apple_Dark />],
    },
    {
      title: strings.googlePay,
      icon: <Google_Icon />,
    },
  ];

  const onPressAddNewCard = () => navigation.navigate(StackNav.AddNewCard);

  const onPressConfirmPayment = () =>
    navigation.navigate(StackNav.ReviewSummary);

  const onPressItem = item => setIsSelected(item.title);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10}>
        <Ionicons
          name="scan"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  }, []);

  const renderPaymentItem = ({item, index}) => {
    return (
      <PaymentSelect
        item={item}
        isSelected={isSelected}
        onPressItem={() => onPressItem(item)}
      />
    );
  };

  const RenderFlashListHeader = () => {
    return (
      <View>
        {!!desc && (
          <EText type={'r16'} style={styles.mv10}>
            {desc}
          </EText>
        )}
      </View>
    );
  };

  const RenderFlashListFooter = () => {
    return (
      <View>
        {!!title && (
          <EButton
            title={strings.addNewCard}
            type={'S16'}
            color={colors.primary5}
            bgColor={colors.dark3}
            containerStyle={styles.mb20}
            onPress={onPressAddNewCard}
          />
        )}
      </View>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader
        title={!!title ? title : strings.payment}
        rightIcon={RightIcon}
      />
      <View style={styles.flex}>
        <FlashList
          data={!!isWallet ? paymentData : paymentData.slice(1)}
          extraData={extraData}
          renderItem={renderPaymentItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.ph20}
          ListHeaderComponent={RenderFlashListHeader}
          ListFooterComponent={RenderFlashListFooter}
          estimatedItemSize={20}
        />
      </View>
      <EButton
        title={!!title ? strings.confirmPayment : strings.addNewCard}
        type={'S16'}
        color={colors.white}
        containerStyle={[styles.mh20, styles.mv10]}
        onPress={!!title ? onPressConfirmPayment : onPressAddNewCard}
      />
    </ESafeAreaView>
  );
};
