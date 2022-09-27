import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, View, Text, Dimensions, useWindowDimensions, Pressable } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import orders from '../../../assets/data/orders.json';
import { Entypo, Ionicons } from "@expo/vector-icons"


// components
import OrderItem from '../../components/OrderItem';


const OrderScreen = () => {

   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])
   const [openDetails, setOpenDetails] = useState(0)



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
                     title={order.Restaurant.name}
                     description={order?.Restaurant?.address}
                     coordinate={{
                        latitude: order?.Restaurant?.lat,
                        longitude: order?.Restaurant?.lng
                     }}
                  >
                     <View style={{ backgroundColor: 'green', borderRadius: 50, padding: 5 }}>
                        <Entypo name="shop" size={24} color="white" />
                     </View>
                  </Marker>
               )
            })}

         </MapView>

         

         <BottomSheet index={openDetails} ref={bottomSheetRef} snapPoints={snapPoints} >
            {openDetails === 1 && (
               <Ionicons
                  onPress={() => setOpenDetails(0)}
                  name='arrow-down'
                  color={"black"}
                  style={{ position: 'absolute', top: 12, left: 30 }}
                  size={40}
               />
            )}
             {openDetails === 0 && (
               <Ionicons
                  onPress={() => setOpenDetails(1)}
                  name='arrow-up'
                  color={"black"}
                  style={{ position: 'absolute', top: 12, right: 30 }}
                  size={40}
               />
            )}
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

            <FlatList
               data={orders}
               renderItem={({ item }) => <OrderItem order={item} />}
            />
         </BottomSheet>
      </View >
   )
}

export default OrderScreen