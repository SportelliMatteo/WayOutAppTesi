// Library import
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Local Imports
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import images from '../../../assets/images';
import {
  validateCardNumber,
  validateCvv,
  validateName,
} from '../../../utils/validators';
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import EInput from '../../../components/common/EInput';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import EButton from '../../../components/common/EButton';
import {Menu_Dark, Menu_Light} from '../../../assets/svgs';
import EDivider from '../../../components/common/EDivider';

export default AddNewCard = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedStyle = {
    borderColor: colors.textColor,
  };
  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.textColor;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [expiryDateIcon, setExpiryDateIcon] = useState(BlurredIconStyle);
  const [cardNumberInputStyle, setCardNumberInputStyle] =
    useState(BlurredStyle);
  const [expiryDateInputStyle, setExpiryDateInputStyle] =
    useState(BlurredStyle);
  const [cvvInputStyle, setCvvInputStyle] = useState(BlurredStyle);
  const [cardNameInputStyle, setCardNameInputStyle] = useState(BlurredStyle);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      !!cardName &&
      !!cardNumber &&
      !!expiryDate &&
      !!cvv &&
      !cardNameError &&
      !cardNumberError &&
      !expiryDateError &&
      !cvvError
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [
    cardName,
    cardNumber,
    expiryDate,
    cvv,
    cardNameError,
    cardNumberError,
    expiryDateError,
    cvvError,
  ]);

  const onChangeCardName = text => {
    const {msg} = validateName(text);
    setCardName(text);
    setCardNameError(msg);
  };

  const onFocusCardName = () => onFocusInput(setCardNameInputStyle);
  const onBlurCardName = () => onBlurInput(setCardNameInputStyle);

  const onChangeCardNumber = text => {
    const {msg} = validateCardNumber(text);
    setCardNumber(text);
    setCardNumberError(msg);
  };

  const onFocusCardNumber = () => onFocusInput(setCardNumberInputStyle);
  const onBlurCardNumber = () => onBlurInput(setCardNumberInputStyle);

  const onChangeExpiryDate = text => {
    setExpiryDate(text);
    if (text.length === 0) {
      setExpiryDateError('Expiry Date is required');
    } else {
      setExpiryDateError('');
    }
  };

  const onFocusExpiryDate = () => {
    onFocusInput(setExpiryDateInputStyle);
    onFocusIcon(setExpiryDateIcon);
  };

  const onBlurExpiryDate = () => {
    onBlurInput(setExpiryDateInputStyle);
    onBlurIcon(setExpiryDateIcon);
  };

  const onChangeCvv = text => {
    const {msg} = validateCvv(text);
    setCvv(text);
    setCvvError(msg);
  };

  const onFocusCvv = () => onFocusInput(setCvvInputStyle);
  const onBlurCvv = () => onBlurInput(setCvvInputStyle);

  const onPressCalender = () => setDatePickerVisible(true);

  const handleDateConfirm = date => {
    var expiryDate = date.toISOString().split('T')[0];
    const month = expiryDate.split('-')[1];
    const year = expiryDate.split('-')[0];
    setExpiryDate(month + '/' + year);
    setDatePickerVisible(false);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  const onPressAdd = () => navigation.goBack();

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.pr10}>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  const RightCalenderIcon = () => {
    return (
      <TouchableOpacity onPress={onPressCalender} style={styles.ph10}>
        <Ionicons
          name="calendar"
          size={moderateScale(26)}
          color={expiryDateIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ESafeAreaView>
      <EHeader title={strings.addNewCard} rightIcon={RightIcon} />
      <KeyBoardAvoidWrapper contentContainerStyle={[styles.ph20]}>
        <Image source={images.creditCard} style={localStyles.creditCardImage} />
        <EDivider style={styles.mv10} />
        <EInput
          label={strings.cardName}
          placeholder={strings.cardName}
          keyboardType="default"
          maxLength={16}
          _value={cardName}
          _errorText={cardNameError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangeCardName}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            cardNameInputStyle,
          ]}
          inputBoxStyle={[localStyles.inputBoxStyle]}
          _onFocus={onFocusCardName}
          onBlur={onBlurCardName}
        />
        <EInput
          label={strings.cardNumber}
          placeholder={strings.cardNumber}
          keyboardType="number-pad"
          maxLength={16}
          _value={cardNumber}
          _errorText={cardNumberError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangeCardNumber}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            cardNumberInputStyle,
          ]}
          inputBoxStyle={[localStyles.inputBoxStyle]}
          _onFocus={onFocusCardNumber}
          onBlur={onBlurCardNumber}
        />
        <View style={[styles.flexRow, styles.justifyBetween, styles.pb10]}>
          <EInput
            label={strings.expiryDate}
            placeholder={strings.expiryDate}
            keyboardType="number-pad"
            maxLength={10}
            _value={expiryDate}
            _errorText={expiryDateError}
            autoCapitalize={'none'}
            toGetTextFieldValue={onChangeExpiryDate}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.dateContainer,
              expiryDateInputStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusExpiryDate}
            onBlur={onBlurExpiryDate}
            _editable={false}
            rightAccessory={() => <RightCalenderIcon />}
          />
          <DateTimePickerModal
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            date={new Date()}
            minimumDate={new Date()}
          />
          <EInput
            label={strings.cvv}
            placeholder={strings.cvv}
            keyboardType="number-pad"
            maxLength={3}
            _value={cvv}
            _errorText={cvvError}
            autoCapitalize={'none'}
            toGetTextFieldValue={onChangeCvv}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.dateContainer,
              cvvInputStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusCvv}
            onBlur={onBlurCvv}
          />
        </View>
      </KeyBoardAvoidWrapper>
      <EButton
        title={strings.add}
        type={'S16'}
        containerStyle={[styles.mv10, styles.mh20]}
        onPress={onPressAdd}
        color={colors.white}
      />
    </ESafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  creditCardImage: {
    width: moderateScale(360),
    height: getHeight(220),
    resizeMode: 'contain',
    ...styles.selfCenter,
    ...styles.mv20,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  dateContainer: {
    width: moderateScale(150),
    height: getHeight(50),
    borderRadius: moderateScale(15),
  },
});
