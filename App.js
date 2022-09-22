
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import orders from './assets/data/orders.json'

// Screen
import OrderScreen from './src/screens/OrderScreen';
// Components
import OrderItem from './src/components/OrderItem';


const order = orders[0]

export default function App() {
  return (
    <View style={styles.container}>

      <OrderScreen />
      {/* <FlatList 
        data={orders}
        renderItem={({item}) => <OrderItem order={item} />}
      /> */}
      
   

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
