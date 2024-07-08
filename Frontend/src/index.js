import { StatusBar } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AppNavigator from "./navigation";
import { styles } from "./themes";
import ESafeAreaView from "./components/common/ESafeAreaView";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { enableLatestRenderer } from "react-native-maps";
import { address } from "./assets/globalVar";
import auth from "@react-native-firebase/auth";
import { StripeProvider } from '@stripe/stripe-react-native';
import { Linking } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

GoogleSignin.configure({
  webClientId:
    "1082412523213-5gnhno4fnj5ot5gm4vj46m6kpvq90agt.apps.googleusercontent.com",
});

enableLatestRenderer();

const App = () => {
  const colors = useSelector((state) => state.theme.theme);

  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      'url',
      (event) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);


  return (
    <StripeProvider
      publishableKey="pk_test_51Op8EpLSLLSnNJPAkdyvuDc2hZ1BLExkUAgaJMtImiH8GUYalGFkN0YNJurhkbV3mU8xICGahz4eJ8KZ00wu7BBd00fFkVk8GB"
      urlScheme="https://www.google.it" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <ESafeAreaView style={styles.flex}>
        <StatusBar
          barStyle={colors.dark == "dark" ? "light-content" : "dark-content"}
        />
        <AppNavigator />
      </ESafeAreaView>
    </StripeProvider>
  );
};

export default App;
