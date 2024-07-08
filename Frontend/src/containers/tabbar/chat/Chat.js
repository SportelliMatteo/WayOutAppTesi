import { StyleSheet, View, Image, KeyboardAvoidingView } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ESafeAreaView from "../../../components/common/ESafeAreaView";
import { colors, styles } from "../../../themes";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat"; // Aggiunto InputToolbar e Send
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { UserLoggedContext } from "../../../context/UserLoggedContext";
import EHeader from "../../../components/common/EHeader";
import EText from "../../../components/common/EText";
import { moderateScale } from "../../../common/constants";
import { useSelector } from "react-redux";
import EHeaderChat from "../../../components/common/EHeaderChat";

export default function Chat({ navigation, route }) {
  const { image, eventName, chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const currentUserUid = auth().currentUser.uid;
  const { userLogged } = useContext(UserLoggedContext);
  const colors = useSelector((state) => state.theme.theme);

  const onSend = (msgArray) => {
    const msg = msgArray[0];
    const usermsg = {
      ...msg,
      sentBy: currentUserUid,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, usermsg)
    );
    

    firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({ ...usermsg });
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const allTheMsgs = snapshot.docs.map((docSnap) => {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
          };
        });
        setMessages(allTheMsgs);
      });

    return () => unsubscribe();
  }, []);

  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;

    return (
      <Bubble
        {...props}
        position={message_sender_id == userLogged.uid ? "right" : "left"}
        wrapperStyle={{
          right: {
            backgroundColor: "#b2ba3e",
          },
          left: {
            backgroundColor: "#d9d9d9",
          },
        }}
      />
    );
  };

  // Funzione per la barra di inserimento personalizzata
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "transparent",
          backgroundColor: colors.dark ? colors.inputBg : "#ededed",
          marginHorizontal: 10,
          marginTop: 10,
          borderRadius: moderateScale(50),
        }}
        textInputStyle={{ color: colors.dark ? "white" : "black", marginTop: 10 }} // Imposta il colore del testo qui
      />
    );
  };

  // Funzione per il tasto di invio personalizzato
  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{}}>
        <View style={{ marginRight: 10, marginBottom: 17 }}>
          <EText style={{ color: "#b2ba3e" }}>Invia</EText>
        </View>
      </Send>
    );
  };

  return (
    <>
      <ESafeAreaView>
          <View
            style={[
              localStyles.root,
              {
                backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              },
            ]}
          >
            <EHeaderChat imageEvent={image} title={eventName} rightImage showAdditionalText />
          </View>
          <GiftedChat
            style={{ flex: 1 }}
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar} // Aggiunta della barra di inserimento personalizzata
            renderSend={renderSend} // Aggiunta del tasto di invio personalizzato
            onSend={(text) => onSend(text)}
            user={{
              _id: auth().currentUser.uid,
              name: userLogged.nome + " " + userLogged.cognome,
              avatar:
                userLogged.profileImages && userLogged.profileImages.length > 0
                  ? userLogged.profileImages[0]
                  : "https://firebasestorage.googleapis.com/v0/b/wayout-app-38483.appspot.com/o/Default.png?alt=media&token=57f63b38-a43d-414d-8740-70b375212620",
            }}
            showUserAvatar={true}
            renderUsernameOnMessage={true}
            placeholder=""
            alwaysShowSend
          />
      </ESafeAreaView>
    </>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.shadowStyle,
  },
});
