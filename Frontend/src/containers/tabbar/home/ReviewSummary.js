import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import SearchCardComponent from '../../../components/homeComponent/SearchCardComponent';
import {popularEventData} from '../../../api/constant';
import {styles} from '../../../themes';
import EText from '../../../components/common/EText';
import {moderateScale} from '../../../common/constants';
import EDivider from '../../../components/common/EDivider';
import {Google_Icon} from '../../../assets/svgs';
import EButton from '../../../components/common/EButton';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function ReviewSummary({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressBack = () => navigation.goBack();

 

  const renderVerticalItem = ({item, index}) => {
    return <SearchCardComponent item={item} key={index} isLike={false} />;
  };

  const InnerContainer = ({children}) => {
    return (
      <View
        style={[
          localStyles.innerContainer,
          {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
        ]}>
        {children}
      </View>
    );
  };

  const InnerText = props => {
    const {text1, text2, isBottom = true} = props;
    return (
      <View style={[styles.rowSpaceBetween, isBottom && styles.pb15]}>
        <EText color={colors.textColor2} type={'s14'}>
          {text1}
        </EText>
        <View style={[styles.flexRow, styles.itemsCenter]}>
          <EText type={'B16'}>{text2}</EText>
        </View>
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View style={styles.mt10}>
        <InnerContainer>
          <InnerText text1={strings.fullName} text2={'Andrew Ainsley'} />
          <InnerText text1={strings.phoneNumber} text2={'+1 111 467 378 399'} />
          <InnerText
            text1={strings.email}
            text2={'andrew_ainsley@yo...com'}
            isBottom={false}
          />
        </InnerContainer>
        <InnerContainer>
          <InnerText text1={'1 Seats (Economy)'} text2={'$50.00'} />
          <InnerText text1={strings.tax} isBottom={false} text2={'$5.00'} />
          <EDivider style={styles.mv15} />
          <InnerText text1={strings.total} text2={'$55.00'} isBottom={false} />
        </InnerContainer>
        <TouchableOpacity
          style={[
            localStyles.selectContainer,
            {backgroundColor: colors.dark ? colors.inputBg : colors.grayScale1},
          ]}>
          <View style={styles.rowCenter}>
            <View style={styles.mh10}>
              <Google_Icon />
            </View>
            <EText type={'B18'}>{strings.googlePay}</EText>
          </View>
          <TouchableOpacity onPress={onPressBack}>
            <EText type={'s14'} color={colors.primary5}>
              {strings.change}
            </EText>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.reviewSummary} />
      <FlashList
        data={popularEventData.slice(0, 1)}
        renderItem={renderVerticalItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        ListFooterComponent={<ListFooterComponent />}
        contentContainerStyle={localStyles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
      <EButton
        title={strings.continue}
        type={'S16'}
        color={colors.white}
        containerStyle={[styles.mh20, styles.mv10]}
      />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  innerContainer: {
    ...styles.mv10,
    ...styles.pv15,
    ...styles.ph20,
    borderRadius: moderateScale(12),
    ...styles.shadowStyle,
  },
  selectContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph15,
    ...styles.pv20,
    ...styles.mv10,
    ...styles.shadowStyle,
    borderRadius: moderateScale(16),
  },
});
