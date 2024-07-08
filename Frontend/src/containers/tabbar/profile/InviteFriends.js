// Library Imports
import {FlatList, StyleSheet} from 'react-native';
import React from 'react';

// Custom Imports
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import UserDetailComponent from '../../../components/UserDetailComponent';
import {userDetail} from '../../../api/constant';
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';

export default function InviteFriends() {
  return (
    <ESafeAreaView>
      <EHeader title={strings.inviteFriends} />
      <FlatList
        data={userDetail}
        renderItem={({item}) => (
          <UserDetailComponent
            userName={'Dracel Steward'}
            userImage={item?.imgUrl}
            userDescription={item?.description}
            string1={strings.invited}
            string2={strings.invite}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
      />
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({});
