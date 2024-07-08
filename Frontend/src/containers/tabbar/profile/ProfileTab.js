// Library Imports
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

// Custom Imports
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import EHeader from "../../../components/common/EHeader";
import { moderateScale } from "../../../common/constants";
import { styles } from "../../../themes";
import { ProfileSetting } from "../../../api/constant";
import strings from "../../../i18n/strings";
import EText from "../../../components/common/EText";
import LogOut from "../../../components/models/LogOut";
import CategoryComponent from "../../../components/profileComponent/CategoryComponent";
import ProfileDetailComponent from "../../../components/homeComponent/ProfileDetailComponent";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import { address } from "../../../assets/globalVar";
import auth from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const getNumberEventsAddress = `http://${address}:8080/get-number-of-events-by-user`;

export default function ProfileTab({ navigation }) {
  const color = useSelector((state) => state.theme.theme);

  const { userLogged } = useContext(UserLoggedContext);
  const [numeroEventi, setNumeroEventi] = useState({
    numeroEventiAttivi: 0,
    numeroEventiInAttesa: 0,
  });

  const LogOutSheetRef = createRef();

  const onPressMenu = () => {};

  const onPressItem = (item) => {
    if (!!item.route) {
      navigation.navigate(item.route);
    }
  };

  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();

  const getNumberEvents = async () => {
    fetch(getNumberEventsAddress, {
      method: "POST",
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUtente: userLogged.id,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setNumeroEventi(result));
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
    getNumberEvents();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNumberEvents();
  }, []);

  useEffect(() => {
    if (refreshing) {
      getNumberEvents().then(() => setRefreshing(false));
    }
  }, [refreshing]);

  const ListHeaderComponent = () => {
    return (
      <View>
        <ProfileDetailComponent
          userName={userLogged.nomeUtente}
          eventsActive={numeroEventi.numeroEventiAttivi}
          eventsUnActive={numeroEventi.numeroEventiInAttesa}
        />
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <TouchableOpacity
        onPress={onPressLogOutBtn}
        style={localStyles.settingsContainer}
      >
        <Ionicons
          name={"log-out-outline"}
          size={moderateScale(28)}
          color={color.redColor}
        />
        <EText
          type="s18"
          color={color.redColor}
          style={localStyles.logOutStyle}
        >
          {strings.logout}
        </EText>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item, index }) => (
    <CategoryComponent item={item} key={index} onPressItem={onPressItem} />
  );

  return (
    <ESafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={"#dcdcdc"}
            colors={["#dcdcdc"]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* L'aggiunta di questa ScrollView "inutile" fixa il warning relativo alle Virtualized Lists*/}
        <ScrollView
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={{ width: "100%" }}
        > 
          <AlertNotificationRoot>
            <EHeader isHideBack={false} title={strings.profile} />
            <View style={{ flex: 1 }}>
              <FlatList
                data={ProfileSetting}
                renderItem={renderCategoryItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={localStyles.root}
              />
              <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />
            </View>
          </AlertNotificationRoot>
        </ScrollView>
      </ScrollView>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.pb20,
  },
  logOutStyle: {
    ...styles.ml15,
  },
  settingsContainer: {
    ...styles.mt15,
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
});
