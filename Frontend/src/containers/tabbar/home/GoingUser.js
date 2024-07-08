import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {Search_Dark, Search_Light} from '../../../assets/svgs';
import {userDetail} from '../../../api/constant';
import UserDetailComponent from '../../../components/UserDetailComponent';
import {FlashList} from '@shopify/flash-list';

export default function GoingUser() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10}>
        {colors.dark ? <Search_Dark /> : <Search_Light />}
      </TouchableOpacity>
    );
  }, []);
  return (
    <ESafeAreaView>
      <EHeader title={strings.goingUser} rightIcon={RightIcon} />
      <FlashList
        data={userDetail}
        renderItem={({item}) => (
          <UserDetailComponent
            userName={'Dracel Steward'}
            userImage={item?.imgUrl}
            string1={strings.followed}
            string2={strings.follow}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
        estimatedItemSize={10}
      />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({});
