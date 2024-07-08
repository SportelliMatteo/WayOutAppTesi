// Library import
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import EText from '../../../components/common/EText';
import EInput from '../../../components/common/EInput';
import EButton from '../../../components/common/EButton';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import EDivider from '../../../components/common/EDivider';

export default function AddAddress({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedStyle = {
    borderColor: colors.textColor,
  };

  const [addressName, setAddressName] = useState('');
  const [addNameStyle, setAddNameStyle] = useState(BlurredStyle);
  const [addressDetail, setAddressDetail] = useState('');
  const [addDetailStyle, setAddDetailStyle] = useState(BlurredStyle);
  const [isCheck, setIsCheck] = useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);

  const onFocusAddName = () => onFocusInput(setAddNameStyle);
  const onBlurAddName = () => onBlurInput(setAddNameStyle);
  const onFocusAddDetail = () => onFocusInput(setAddDetailStyle);
  const onBlurAddNDetail = () => onBlurInput(setAddDetailStyle);

  const onChangeAddName = text => setAddressName(text);
  const onChangeAddDetail = text => setAddressDetail(text);

  const onPressAdd = () => navigation.goBack();

  return (
    <ESafeAreaView>
      <EHeader title={strings.addNewAddress} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={styles.flex}>
          <Image
            resizeMode="cover"
            source={images.mapImage}
            style={localStyles.mapImage}
          />
        </View>
        <View
          style={[
            localStyles.bottomContainer,
            {backgroundColor: colors.backgroundColor},
          ]}>
          <EText
            type={'B20'}
            style={localStyles.titleContainer}
            align={'center'}>
            {strings.addressDetail}
          </EText>
          <EDivider style={styles.mv5} />
          <EInput
            label={strings.nameAddress}
            placeHolder={strings.addressName}
            _value={addressName}
            autoCapitalize={'none'}
            toGetTextFieldValue={onChangeAddName}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              addNameStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusAddName}
            onBlur={onBlurAddName}
          />
          <EInput
            label={strings.addressDetail}
            placeHolder={strings.addressDetail}
            _value={addressDetail}
            autoCapitalize={'none'}
            toGetTextFieldValue={onChangeAddDetail}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              addDetailStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusAddDetail}
            onBlur={onBlurAddNDetail}
          />
          <TouchableOpacity
            onPress={() => setIsCheck(!isCheck)}
            style={localStyles.checkboxContainer}>
            <Ionicons
              name={isCheck ? 'square-outline' : 'checkbox'}
              size={moderateScale(26)}
              color={colors.textColor}
            />
            <EText type={'r18'} style={styles.mh10}>
              {strings.makeDefault}
            </EText>
          </TouchableOpacity>
          <EButton
            title={strings.add}
            type={'S16'}
            containerStyle={styles.mv10}
            onPress={onPressAdd}
          />
        </View>
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  mapImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    ...styles.ph20,
  },
  titleContainer: {
    ...styles.p20,
  },
  checkboxContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
  },
});
