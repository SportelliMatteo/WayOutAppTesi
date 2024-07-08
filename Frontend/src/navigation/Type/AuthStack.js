import React from "react";
import { StackNav } from "../NavigationKeys";
import { StackRoute } from "../NavigationStackRoutes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={StackNav.Connect}
    >
      <Stack.Screen name={StackNav.Login} component={StackRoute.Login} />
      <Stack.Screen name={StackNav.Register} component={StackRoute.Register} />

      <Stack.Screen name={StackNav.Location} component={StackRoute.Location} />
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
        name={StackNav.ForgotPassword}
        component={StackRoute.ForgotPassword}
      />
      <Stack.Screen
        name={StackNav.VerifyProfileEmail}
        component={StackRoute.VerifyProfileEmail}
      />
      <Stack.Screen
        name={StackNav.CreateNewPassword}
        component={StackRoute.CreateNewPassword}
      />
    </Stack.Navigator>
  );
}
