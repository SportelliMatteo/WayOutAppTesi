import {Image,StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {Menu_Dark, Menu_Light} from '../../../assets/svgs';
import {commonColor, styles} from '../../../themes';
import ProfileDetailComponent from '../../../components/homeComponent/ProfileDetailComponent';
import EButton from '../../../components/common/EButton';
import {moderateScale} from '../../../common/constants';
import {FlashList} from '@shopify/flash-list';
import {popularEventData} from '../../../api/constant';
import SearchCardComponent from '../../../components/homeComponent/SearchCardComponent';
import EText from '../../../components/common/EText';
import EDivider from '../../../components/common/EDivider';

export default function Organizer({route}) {
  const colors = useSelector(state => state.theme.theme);
  const {userName, userImage} = route.params;

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10}>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  const renderVerticalItem = ({item, index}) => {
    return <SearchCardComponent item={item} key={index} />;
  };

  const HeaderComponent = () => {
    return (
      <View>
         <View style={[styles.selfCenter, styles.mb20]}>
        <Image
          source={{
            uri:userImage
          }}
          style={localStyles.userImage}
        />
      </View>
      <View style={styles.mb20}>
        <EText type="b24" align={"center"}>
          {userName}
        </EText>
      </View>
      <EDivider/>
        {/*
        <View style={localStyles.btnContainer}>
          <EButton
            title={strings.follow}
            type={'S16'}
            containerStyle={localStyles.skipBtnContainer}
          />
          <EButton
            title={strings.message}
            type={'S16'}
            color={colors.primary5}
            containerStyle={localStyles.skipBtnContainer}
            bgColor={colors.tranparent}
          />
        </View>*/}
      </View>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.profileOrganizer} />
      <FlashList
        data={popularEventData}
        renderItem={renderVerticalItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        ListHeaderComponent={<HeaderComponent />}
        contentContainerStyle={localStyles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  btnContainer: {
    ...styles.pv10,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary5,
  },
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },

  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
});
