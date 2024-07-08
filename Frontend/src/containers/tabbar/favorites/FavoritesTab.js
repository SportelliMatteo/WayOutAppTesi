// Library import
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EText from '../../../components/common/EText';
import {
  AppLogo,
  FilterDark,
  FilterLight,
  HorizantalActive,
  HorizantalInActive,
  Search_Dark,
  Search_Light,
  VerticalActive,
  VerticalInActive,
} from '../../../assets/svgs';
import {styles} from '../../../themes';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';
import SearchCardComponent from '../../../components/homeComponent/SearchCardComponent';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import MostPopularCategory from '../../../components/homeComponent/MostPopularCategory';
import {popularEventData} from '../../../api/constant';
import TrashItem from '../../../components/models/TrashItem';
import {moderateScale} from '../../../common/constants';

const HeaderComponent = React.memo(({isVertical, onPressResize}) => {
  return (
    <View style={styles.mt10}>
      <MostPopularCategory />
      <View style={localStyles.subHeader}>
        <EText type={'b18'} style={styles.flex}>
          {'Sort by'}
        </EText>
        <View style={styles.flexRow}>
          <TouchableOpacity style={styles.mh10} onPress={onPressResize}>
            {!isVertical ? <VerticalActive /> : <VerticalInActive />}
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressResize}>
            {isVertical ? <HorizantalActive /> : <HorizantalInActive />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function FavoritesTab({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const [isVertical, setIsVertical] = useState(false);
  const [trashData, setTrashData] = useState(null);
  const trashSheetRef = useRef(null);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors, isVertical]);

  const onPressSearch = () => navigation.navigate(StackNav.Search);

  const onPressCard = item => {
    setTrashData(item);
    trashSheetRef?.current?.show();
  };

  const renderItem = ({item, index}) => {
    return (
      <SearchCardComponent
        item={item}
        index={index}
        onPressCard={() => onPressCard(item)}
      />
    );
  };

  const renderVerticalItem = ({item, index}) => {
    return (
      <SmallCardComponent
        item={item}
        index={index}
        onPressCard={() => onPressCard(item)}
      />
    );
  };

  const onPressResize = useCallback(
    () => setIsVertical(!isVertical),
    [isVertical],
  );

  const RightIcon = useMemo(() => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={onPressSearch}>
          {colors.dark ? <Search_Dark /> : <Search_Light />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.ph10}>
          {colors.dark ? <FilterDark /> : <FilterLight />}
        </TouchableOpacity>
      </View>
    );
  }, []);

  const LeftIcon = useMemo(() => {
    return (
      <View style={styles.pr10}>
        <AppLogo width={moderateScale(30)} height={moderateScale(30)} />
      </View>
    );
  }, []);

  return (
    <ESafeAreaView>
      <EHeader
        isHideBack={true}
        title={strings.favorites}
        isLeftIcon={LeftIcon}
        rightIcon={RightIcon}
      />
      <FlashList
        data={popularEventData}
        extraData={extraData}
        renderItem={isVertical ? renderVerticalItem : renderItem}
        numColumns={isVertical && 2}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        ListHeaderComponent={
          <HeaderComponent
            isVertical={isVertical}
            onPressResize={onPressResize}
          />
        }
        contentContainerStyle={localStyles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
      <TrashItem SheetRef={trashSheetRef} item={trashData} />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.mt10,
    width: '100%',
  },
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  subHeader: {
    ...styles.rowSpaceBetween,
    ...styles.mt15,
  },
});
