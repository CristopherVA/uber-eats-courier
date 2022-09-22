import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Entypo } from "@expo/vector-icons"

import orders from './assets/data/orders.json'

const order = orders[0]

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        borderColor: '#3FC060',
        borderWidth: 2,
        borderRadius: 10,

      }}>
        <Image

          source={{ uri: order.Restaurant.image }}
          style={{ width: 90, height: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
        />
        <View
          style={{ marginLeft: 10 }}
        >
          <Text style={{ fontWeight: '500', fontSize: 18 }}>{order.Restaurant.name}</Text>
          <Text style={{ color: 'grey' }}>{order.Restaurant.address}</Text>

          <Text style={{ marginTop: 8, fontWeight: '500', fontSize: 16 }}>Delivery Details:</Text>

          <Text style={{ color: 'grey' }}>{order.User.name}</Text>
          <Text style={{ color: 'grey' }}>{order.User.address}</Text>
        </View>

        <View style={{ backgroundColor: '#3FC060', borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: "center" }}>

          <Entypo
            name='check'
            size={30}
            color="black"
            style={{
              marginLeft: "auto"
            }}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
