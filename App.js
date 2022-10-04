import { GestureHandlerRootView } from "react-native-gesture-handler"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';

import { Amplify } from "aws-amplify"
import { withAuthenticator } from "aws-amplify-react-native";
import awsconfig from './src/aws-exports'
import AuthContextProvider from './src/context/AuthContext'
import OrderContextProvider from "./src/context/OrderContext";
import { LogBox } from 'react-native'

LogBox.ignoreAllLogs(["Setting a timer"])
Amplify.configure({ ...awsconfig, Analytics: { disabled: true } })

function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <OrderContextProvider>
            <Navigation />
          </OrderContextProvider>
        </AuthContextProvider>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App)
