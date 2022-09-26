
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import orders from './assets/data/orders.json'

// Screen
import OrderScreen from './src/screens/OrderScreen';
import OrderDeliver from './src/screens/OrderDelivery';

const order = orders[0]


export default function App() {
  return (
    <View style={styles.container}>
      <OrderDeliver />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 30
  },
});
