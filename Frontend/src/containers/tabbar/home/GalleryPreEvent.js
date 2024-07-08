import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

// Custom Imports
import {styles} from '../../../themes';
import strings from '../../../i18n/strings';
import {Menu_Dark, Menu_Light} from '../../../assets/svgs';
import EHeader from '../../../components/common/EHeader';
import ESafeAreaView from '../../../components/common/ESafeAreaView';
import GalleryPreEventComponent from '../../../components/homeComponent/GalleryPreEventComponent';

export default function GalleryPreEvent() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10}>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  return (
    <ESafeAreaView>
      <EHeader title={strings.galleryPreEvent} rightIcon={RightIcon} />
      <View style={localStyles.root}>
        <GalleryPreEventComponent isMore={true} />
      </View>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.flex,
  },
});
