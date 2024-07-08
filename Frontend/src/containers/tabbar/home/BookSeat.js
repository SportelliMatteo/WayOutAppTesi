import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import EText from '../../../components/common/EText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import EButton from '../../../components/common/EButton';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function BookSeat({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);
  const [seat, setSeat] = useState(1);

  const onPressMinus = () => {
    if (seat > 1) {
      setSeat(prev => prev - 1);
    }
  };

  const onPressPlus = () => {
    setSeat(prev => prev + 1);
  };

  const categoryData = [
    {
      id: 0,
      title: strings.economy,
      onPress: () => setIsSelect(0),
    },
    {
      id: 1,
      title: strings.vip,
      onPress: () => setIsSelect(1),
    },
  ];

  const onPressContinue = () => navigation.navigate(StackNav.BookEvent);

  const HeaderCategory = () => {
    return categoryData.map((item, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={item.onPress}
          style={[
            localStyles.root,
            {
              borderBottomColor:
                isSelect === item.id ? colors.primary5 : colors.dark3,
            },
          ]}>
          <EText
            type={'s18'}
            align={'center'}
            style={styles.pb20}
            color={isSelect === item.id ? colors.primary5 : colors.grayScale7}>
            {item.title}
          </EText>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.bookEvent} />
      <View style={localStyles.mainContainer}>
        <HeaderCategory />
      </View>
      <View style={styles.ph20}>
        <EText type={'b18'} style={styles.pv20}>
          {'Choose number of seats'}
        </EText>
        <View style={[styles.flexRow, styles.center, styles.mv10]}>
          <TouchableOpacity
            onPress={onPressMinus}
            style={[
              localStyles.iconStyle,
              {
                backgroundColor: colors.dark && colors.dark2,
                borderColor: colors.dark ? colors.dark3 : colors.grayScale3,
              },
            ]}>
            <Ionicons
              name={'remove'}
              size={moderateScale(28)}
              color={colors.primary5}
            />
          </TouchableOpacity>
          <View style={localStyles.searContainer}>
            <EText type={'s20'} align={'center'}>
              {seat}
            </EText>
          </View>
          <TouchableOpacity
            onPress={onPressPlus}
            style={[
              localStyles.iconStyle,
              {
                backgroundColor: colors.dark && colors.dark2,
                borderColor: colors.dark ? colors.dark3 : colors.grayScale3,
              },
            ]}>
            <Ionicons
              name={'add'}
              size={moderateScale(28)}
              color={colors.primary5}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={localStyles.bottomContainer}>
        <EButton
          title={'Continue - $50.00'}
          type={'S16'}
          onPress={onPressContinue}
        />
      </View>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flexRow,
    ...styles.ph20,
    width: '100%',
  },
  root: {
    borderBottomWidth: moderateScale(2),
    width: '50%',
  },
  iconStyle: {
    ...styles.p10,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(14),
  },
  searContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    ...styles.center,
  },
  bottomContainer: {
    ...styles.ph20,
    ...styles.pv10,
    ...styles.flex,
    ...styles.justifyEnd,
  },
});
