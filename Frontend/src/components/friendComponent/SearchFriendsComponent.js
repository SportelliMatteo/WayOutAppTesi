import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useRef} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import EInput from '../common/EInput';
import {Search_Icon} from '../../assets/svgs';
import strings from '../../i18n/strings';
import {moderateScale} from '../../common/constants';
import SortAndFilter from '../models/SortAndFilter';
import {useNavigation} from '@react-navigation/native';
import {StackNav} from '../../navigation/NavigationKeys';

const SearchFriendsComponent = props => {
  const {onSearchInput, search} = props;
  const colors = useSelector(state => state.theme.theme);
  const sortAndFilterRef = useRef();
  const navigation = useNavigation();

  const onPressSearch = () => navigation.navigate(StackNav.Search);

  const searchIcon = () => {
    return (
      <TouchableOpacity onPress={onPressSearch}>
        <Search_Icon />
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <EInput
        placeHolder={strings.searchPlaceholder2}
        _value={search}
        keyBoardType={'default'}
        autoCapitalize={'none'}
        insideLeftIcon={searchIcon}
        toGetTextFieldValue={onSearchInput}
        inputContainerStyle={[
          {backgroundColor: colors.inputBg},
          localStyles.inputContainerStyle,
        ]}
      />
      <SortAndFilter SheetRef={sortAndFilterRef} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
});

export default memo(SearchFriendsComponent);
