import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
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
import SearchCardComponentUser from '../../../components/homeComponent/SearchCardComponentUser';
import { address } from '../../../assets/globalVar';
import auth from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const getActiveEventsByUidAddress = `http://${address}:8080/get-active-event-user`;
const getUnactiveEventsByUidAddress = `http://${address}:8080/get-unactive-event-user`;
 
export default function MyEvents({route}) {
  const colors = useSelector(state => state.theme.theme);
  const {title} = route.params;

  const [activeEvents, setActiveEvents] = useState([]);
  const [unactiveEvents, setUnactiveEvents] = useState([]);

  const RightIcon = useMemo(() => {
    return (
      <TouchableOpacity style={styles.ph10}>
        {colors.dark ? <Menu_Dark /> : <Menu_Light />}
      </TouchableOpacity>
    );
  }, []);

  const renderVerticalItem = ({item, index}) => {
    return <SearchCardComponentUser item={item} key={index} />;
  };

  const getActiveEventsByUid = async () => {
    fetch(getActiveEventsByUidAddress, {
      method: "GET",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setActiveEvents(result["activeEvents"]));
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
      }
    });
  };

  const getUnactiveEventsByUid = async () => {
    fetch(getUnactiveEventsByUidAddress, {
      method: "GET",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setUnactiveEvents(result["unactiveEvents"]));
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
      }
    });
  };

  useEffect(()=>{
    if(title === strings.eventsActive){
      getActiveEventsByUid();
    }else{
      getUnactiveEventsByUid();
    }
    
  },[])

  return (
    <AlertNotificationRoot>
      <ESafeAreaView>
        <EHeader title={title === strings.eventsActive ? strings.eventsActive : strings.eventsUnActive} />
        <FlashList
          data={title === strings.eventsActive ? activeEvents : unactiveEvents}
          renderItem={renderVerticalItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          contentContainerStyle={localStyles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        />
      </ESafeAreaView>
    </AlertNotificationRoot>
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
});
