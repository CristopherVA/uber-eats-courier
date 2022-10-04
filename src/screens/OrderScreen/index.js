import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { DataStore } from 'aws-amplify';
import { Order } from '../../models';

// components
import OrderItem from '../../components/OrderItem';
import CustomMarker from '../../components/CustomMarker';


const OrderScreen = () => {

   const [orders, setOrders] = useState([])
   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])
   const fetchOrder = () => {
      DataStore.query(Order, (o) => o.status("eq", "READY_FOR_PICKUP")).then(setOrders);
   }


   useEffect(() => {

      fetchOrder()

      const subcription = DataStore.observe(Order).subscribe(msg => {
         if(msg.opType === "UPDATE"){
            fetchOrder()
         }
      })

      return subcription.unsubscribe()
      
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
                  <CustomMarker
                     key={order.id}
                     data={order.Restaurant}
                     type="RESTAURANT"
                  />
               )
            })}

         </MapView>

         <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
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