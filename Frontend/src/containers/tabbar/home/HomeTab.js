// Library Imports
import { StyleSheet, View, RefreshControl, ScrollView } from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
// Custom Imports
import { styles } from "../../../themes";
import { EventData } from "../../../api/constant";
import SearchComponent from "../../../components/homeComponent/SearchComponent";
import HomeHeader from "../../../components/homeComponent/HomeHeader";
import SubHeader from "../../../components/SubHeader";
//import MostPopularCategory from '../../../components/homeComponent/MostPopularCategory';
import { StackNav } from "../../../navigation/NavigationKeys";
import strings from "../../../i18n/strings";
import CardComponent from "../../../components/homeComponent/CardComponent";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import auth from "@react-native-firebase/auth";
import { address } from "../../../assets/globalVar";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const getAllEventsByCityAddress = `http://${address}:8080/get-all-events-by-city`;

export default function HomeTab() {
  const colors = useSelector((state) => state.theme.theme);

  const { userLogged } = useContext(UserLoggedContext);
  const [events, setEvents] = useState([]);

  const getAllEventsByCity = async () => {
    fetch(getAllEventsByCityAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomecitta: userLogged.city,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setEvents(result["events"]));
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Errore",
          textBody: "Errore interno, riprova più tardi.",
        });
      }
    });
  };

  useEffect(() => {
    if (Object.keys(userLogged).length > 0) {
      getAllEventsByCity();
    }
  }, [userLogged]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllEventsByCity();
  }, []);

  useEffect(() => {
    if (refreshing) {
      getAllEventsByCity().then(() => setRefreshing(false));
    }
  }, [refreshing]);

  const renderCategoryItem = ({ item, index }) => {
    return <CardComponent item={item} key={index} />;
  };

  return (
    <View
      style={[styles.flexGrow1, { backgroundColor: colors.backgroundColor }]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl tintColor={'#dcdcdc'} colors={['#dcdcdc']} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FlashList
          data={events}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          numColumns={1}
          ListHeaderComponent={<RenderHeaderItem />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.contentContainerStyle}
        />
      </ScrollView>
    </View>
  );
}

const RenderHeaderItem = React.memo(() => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const onSearchInput = useCallback((text) => setSearch(text), []);

  const { userLogged } = useContext(UserLoggedContext);

  return (
    <AlertNotificationRoot>
      <View>
        <HomeHeader />
        <SearchComponent search={search} onSearchInput={onSearchInput} />
        <SubHeader
          title1={
            strings.featured + " " + userLogged.city + ", " + userLogged.state
          }
        />
      </View>
    </AlertNotificationRoot>
  );
});

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
});
