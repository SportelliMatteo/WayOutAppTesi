
/**
 * @format
 */
import React, { useState, useEffect, createContext } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { name as appName } from "./app.json";
import App from "./src";
import store from "./src/redux/store";
import { address } from "./src/assets/globalVar";
import auth from "@react-native-firebase/auth";
import { UserLoggedContext } from "./src/context/UserLoggedContext";

const userLoggedAddress = `http://${address}:8080/user-logged`;

const RNRoot = () => {
  const [userLogged, setUserLogged] = useState({});

  const fetchData = async () => {
    const token = await auth().currentUser.getIdToken();
    fetch(userLoggedAddress, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: token,
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((result) => setUserLogged(result["user"]));
      } else if (res.status === 5000) {
        //In questo caso il token non nullo che ho salvato non è valido e devo rifare l'accesso
        setUserLogged({});
      } else {
        console.log("Errore durante il login da app:");
        setUserLogged({});
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*useEffect(() => {
    auth()
      .signOut()
      .then(() => {
        console.log("Logout effettuato");
      })
  }, [])*/

  return (
    <UserLoggedContext.Provider value={{userLogged, setUserLogged}}>
      <Provider store={store}>
        <App />
      </Provider>
    </UserLoggedContext.Provider>
  );
};

AppRegistry.registerComponent(appName, () => RNRoot);
