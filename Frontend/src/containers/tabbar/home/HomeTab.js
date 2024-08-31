import React, { useState, useEffect, useCallback, useContext } from "react";
import { StyleSheet, View, RefreshControl, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../../themes";
import { EventData } from "../../../api/constant";
import SearchComponent from "../../../components/homeComponent/SearchComponent";
import HomeHeader from "../../../components/homeComponent/HomeHeader";
import SubHeader from "../../../components/SubHeader";
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
  const [searchQuery, setSearchQuery] = useState(""); // Stato per la stringa di ricerca

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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllEventsByCity();
  }, []);

  useEffect(() => {
    if (refreshing) {
      getAllEventsByCity().then(() => setRefreshing(false));
    }
  }, [refreshing]);

  // Filtra gli eventi in base alla stringa di ricerca
  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          data={filteredEvents} // Usa gli eventi filtrati
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          estimatedItemSize={10}
          numColumns={1}
          ListHeaderComponent={
            <RenderHeaderItem
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.contentContainerStyle}
        />
      </ScrollView>
    </View>
  );
}

const RenderHeaderItem = React.memo(({ searchQuery, setSearchQuery }) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(searchQuery);

  const onSearchInput = useCallback(
    (text) => {
      setSearch(text);
      setSearchQuery(text); // Aggiorna la stringa di ricerca nel componente padre
    },
    [setSearchQuery]
  );

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
