import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackRoute} from '../NavigationStackRoutes';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={StackNav.Splash}>
      <Stack.Screen name={StackNav.Splash} component={StackRoute.Splash} />
      <Stack.Screen
        name={StackNav.onBoarding}
        component={StackRoute.OnBoarding}
      />
      <Stack.Screen name={StackNav.Auth} component={AuthStack} />
      <Stack.Screen name={StackNav.TabBar} component={StackRoute.TabBar} />
      {/*<Stack.Screen
        name={StackNav.ProfileTab}
        component={StackRoute.ProfileTab}
    />*/}
      <Stack.Screen
        name={StackNav.SetUpProfile}
        component={StackRoute.SetUpProfile}
      />
      <Stack.Screen
        name={StackNav.ProfileInformation}
        component={StackRoute.ProfileInformation}
      />
       <Stack.Screen
        name={StackNav.EditUsername}
        component={StackRoute.EditUsername}
      />
      <Stack.Screen
        name={StackNav.AddAddress}
        component={StackRoute.AddAddress}
      />
      <Stack.Screen
        name={StackNav.AddNewCard}
        component={StackRoute.AddNewCard}
      />
      <Stack.Screen name={StackNav.Address} component={StackRoute.Address} />
      <Stack.Screen
        name={StackNav.HelpCenter}
        component={StackRoute.HelpCenter}
      />
      <Stack.Screen name={StackNav.Language} component={StackRoute.Language} />
      <Stack.Screen
        name={StackNav.NotificationSetting}
        component={StackRoute.NotificationSetting}
      />
      <Stack.Screen name={StackNav.Payment} component={StackRoute.Payment} />
      <Stack.Screen
        name={StackNav.PrivacyPolicy}
        component={StackRoute.PrivacyPolicy}
      />
      <Stack.Screen name={StackNav.Security} component={StackRoute.Security} />
      <Stack.Screen
        name={StackNav.CreateNewPassword}
        component={StackRoute.CreateNewPassword}
      />
      <Stack.Screen
        name={StackNav.InviteFriends}
        component={StackRoute.InviteFriends}
      />
      <Stack.Screen
        name={StackNav.Chat}
        component={StackRoute.Chat}
      />
      <Stack.Screen
        name={StackNav.Notification}
        component={StackRoute.Notification}
      />
      <Stack.Screen
        name={StackNav.EventDetail}
        component={StackRoute.EventDetail}
      />
      <Stack.Screen
        name={StackNav.PopularEvent}
        component={StackRoute.PopularEvent}
      />
      <Stack.Screen
        name={StackNav.GalleryPreEvent}
        component={StackRoute.GalleryPreEvent}
      />
      <Stack.Screen
        name={StackNav.GoingUser}
        component={StackRoute.GoingUser}
      />
      <Stack.Screen
        name={StackNav.Organizer}
        component={StackRoute.Organizer}
      />
      <Stack.Screen
        name={StackNav.BookEvent}
        component={StackRoute.BookEvent}
      />
      <Stack.Screen name={StackNav.BookSeat} component={StackRoute.BookSeat} />
      <Stack.Screen
        name={StackNav.ReviewSummary}
        component={StackRoute.ReviewSummary}
      />
      <Stack.Screen
        name={StackNav.MyEvents}
        component={StackRoute.MyEvents}
      />
    </Stack.Navigator>
  );
}
