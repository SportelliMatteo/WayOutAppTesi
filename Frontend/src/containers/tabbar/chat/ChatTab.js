import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import { commonColor, styles } from "../../../themes";
import { moderateScale } from "../../../common/constants";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import EText from "../../../components/common/EText";
import { StackNav } from "../../../navigation/NavigationKeys";
import SearchCardComponent from "../../../components/homeComponent/SearchCardComponent";
import { useSelector } from "react-redux";

export default function TicketsTab({ navigation }) {
  const [groups, setGroups] = useState(null);
  const colors = useSelector((state) => state.theme.theme);

  const currentUser = auth().currentUser;

  const getGroups = () => {
    const userDocRef = firestore().collection('users').doc(currentUser.uid);

    return userDocRef.onSnapshot(documentSnapshot => {
      let groupsId = [];
      if (documentSnapshot.exists) {
        groupsId = documentSnapshot.data().chats || [];
      } else {
        console.log('Documento non trovato!');
        setGroups([]);
        return;
      }

      if (groupsId.length === 0) {
        setGroups([]);
        return;
      }

      // Setup a listener for changes in the chats collection
      const unsubscribe = firestore()
        .collection('chats')
        .where(firestore.FieldPath.documentId(), 'in', groupsId)
        .onSnapshot(querySnapshot => {
          const groupsTmp = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setGroups(groupsTmp);
        }, error => {
          console.error('Errore durante il recupero delle chat: ', error);
          setGroups([]); // Reset groups in case of error
        });

      // Cleanup the listener when the component unmounts or groupsId changes
      return () => unsubscribe();
    }, error => {
      console.error('Errore durante il recupero del documento utente: ', error);
      setGroups([]); // Reset groups in case of error
    });
  };

  useEffect(() => {
    const unsubscribe = getGroups();

    // Cleanup the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    
  }, []);

  return (
    <ESafeAreaView>
      <ScrollView>
        <ScrollView
          horizontal={true}
          scrollEnabled={false}
          contentContainerStyle={{ width: "100%" }}
        >
          <View style={styles.Contain}>
            <FlatList
              data={groups}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(StackNav.Chat, {
                      eventName: item.eventName,
                      chatId: item.id,
                      image: item.image,
                    })
                  }
                >
                  <View style={[
                    localStyles.card,
                    {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1}
                    ]}>
                    <Image
                      style={localStyles.image}
                      source={{ uri: item.image }}
                    />
                    <View style={localStyles.textArea}>
                      <Text style={[localStyles.nameText, {color: colors.dark ? "white" : "black"}]}>{item.eventName} - {item.date}</Text>
                      <Text style={[localStyles.location, {color: colors.textColor2}]}>{item.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </ESafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  card:{
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    width: moderateScale(350),
    padding: 7,
    borderRadius: 20,
    ...styles.shadowStyle,
  },
  image:{
    width:55, 
    height:55,
    borderRadius: 30,
  },
  textArea:{
    marginLeft: 12,
  },
  nameText:{
    fontSize: 15,
    fontWeight: "bold",
  },
  location:{
    fontSize: 11,
    marginTop: 6,
  }
});
