import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";

// Local Imports
import { TabRoute } from "../NavigationTabRoutes";
import { TabNav } from "../NavigationKeys";
import { styles } from "../../themes";
import { getHeight } from "../../common/constants";
import strings from "../../i18n/strings";
import EText from "../../components/common/EText";

import {
  AddActive,
  AddUnActive,
  HomeActive,
  HomeUnActive,
  ChatActive,
  ChatUnActive,
  ProfileActive,
  ProfileUnActive,
} from "../../assets/svgs";

export default function TabBarNavigation() {
  const colors = useSelector((state) => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const TabText = memo(({ IconType, label, focused }) => (
    <View style={localStyle.tabViewContainer}>
      {IconType}
      <EText
        style={styles.mt5}
        numberOfLines={1}
        color={focused ? colors.textColor : colors.grayScale5}
        type={"R14"}
      >
        {label}
      </EText>
    </View>
  ));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          localStyle.tabBarStyle,
          { backgroundColor: colors.backgroundColor },
        ],
        tabBarShowLabel: false,
      }}
      initialRouteName={TabNav.HomeTab}
    >
      <Tab.Screen
        name={TabNav.HomeTab}
        component={TabRoute.HomeTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabText
              IconType={focused ? <HomeActive /> : <HomeUnActive />}
              focused={focused}
              label={strings.home}
            />
          ),
        }}
      />

      <Tab.Screen
        name={TabNav.CreateTab}
        component={TabRoute.CreateTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabText
              IconType={focused ? <AddActive /> : <AddUnActive />}
              focused={focused}
              label={strings.create}
            />
          ),
        }}
      />

      <Tab.Screen
        name={TabNav.ChatTab}
        component={TabRoute.ChatTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabText
              IconType={focused ? <ChatActive /> : <ChatUnActive />}
              focused={focused}
              label={strings.chat}
            />
          ),
        }}
      />

      {/*<Tab.Screen
        name={TabNav.FriendsTab}
        component={TabRoute.FriendsTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <FriendsActive /> : <FriendsUnActive />}
              focused={focused}
              label={strings.friends}
            />
          ),
        }}
      />*/}

      <Tab.Screen
        name={TabNav.ProfileTab}
        component={TabRoute.ProfileTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabText
              IconType={focused ? <ProfileActive /> : <ProfileUnActive />}
              focused={focused}
              label={strings.profile}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    height: getHeight(60),
    ...styles.ph20,
    borderTopWidth: 0,
  },
  tabViewContainer: {
    ...styles.center,
  },
});
