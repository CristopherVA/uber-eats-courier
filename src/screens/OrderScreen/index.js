import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Entypo } from "@expo/vector-icons"
import { DataStore } from 'aws-amplify';
import { Order } from '../../models';

// components
import OrderItem from '../../components/OrderItem';


const OrderScreen = () => {

   const [orders, setOrders] = useState([])
   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])

   console.log(orders)

   useEffect(() => {
      DataStore.query(Order, (o) => o.status("eq", "READY_FOR_PICKUP")).then(setOrders);
   }, [])

   return (
      <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
         <MapView
            style={{
               height: height,
               width: width,
            }}
            showsUserLocation
            followsUserLocation
         >
            {orders.map((order) => {
               return (
                  <Marker
                     key={order.id}
                     title={order.Restaurant?.name}
                     description={order.Restaurant?.address}
                     coordinate={{
                        latitude: order.Restaurant?.lat,
                        longitude: order.Restaurant?.lng
                     }}
                  >
                     <View style={{ backgroundColor: 'green', borderRadius: 50, padding: 5 }}>
                        <Entypo name="shop" size={24} color="white" />
                     </View>
                  </Marker>
               )
            })}

         </MapView>



         <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
               <Text
                  style={{
                     fontSize: 20,
                     fontWeight: '600',
                     letterSpacing: 0.5,
                     paddingBottom: 5
                  }}

               >You're Online</Text>
               <Text
                  style={{
                     letterSpacing: 0.5,
                     color: 'grey'
                  }}
               >Available Orders: {orders.length}</Text>
            </View>

            <BottomSheetFlatList
               data={orders}
               renderItem={({ item }) => <OrderItem order={item} />}
            />


         </BottomSheet>
      </View >
   )
}

export default OrderScreen