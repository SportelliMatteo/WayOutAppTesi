import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import strings from '../../../i18n/strings';
import EHeader from '../../../components/common/EHeader';
import {Menu_Dark, Menu_Light} from '../../../assets/svgs';
import {commonColor, styles} from '../../../themes';
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import {moderateScale} from '../../../common/constants';
import EText from '../../../components/common/EText';
import {notificationData} from '../../../api/constant';
import RenderNullComponent from '../../../components/RenderNullComponent';

export default function Notification() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  const RenderNotificationItem = ({item, index}) => {
    return (
      <TouchableOpacity style={localStyles.root}>
        <View key={index} style={localStyles.renderContainer}>
          {item?.image}
          <View style={localStyles.textStyle}>
            <EText numberOfLines={1} type={'b18'}>
              {item?.title}
            </EText>
            <EText type={'s14'} numberOfLines={1} style={styles.mt5}>
              {item?.description}
            </EText>
          </View>
          {!!item?.isNew && (
            <View style={localStyles.newContainer}>
              <EText type={'s12'}>{strings.new}</EText>
            </View>
          )}
        </View>
        <EText type={'s14'} color={colors.textColor2} style={styles.mt10}>
          {item?.desc}
        </EText>
      </TouchableOpacity>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.notification} rightIcon={RightIcon} />
      {!!notificationData.length ? (
        <FlashList
          data={notificationData}
          keyExtractor={(item, index) => item + index}
          renderItem={RenderNotificationItem}
          stickyHeaderHiddenOnScroll={true}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={10}
        />
      ) : (
        <RenderNullComponent
          title1={strings.empty}
          title2={strings.emptyDesc}
        />
      )}
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.mt20,
  },
  renderContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    borderRadius: moderateScale(10),
  },
  textStyle: {
    ...styles.mh10,
    ...styles.flex,
    ...styles.justifyCenter,
  },
  headerContainer: {
    ...styles.ml20,
    ...styles.mb15,
  },
  newContainer: {
    ...styles.center,
    ...styles.p5,
    borderRadius: moderateScale(5),
    backgroundColor: commonColor.primary5,
  },
});
