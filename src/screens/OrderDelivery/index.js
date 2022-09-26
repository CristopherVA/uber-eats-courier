import React, { useMemo, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome5, Fontisto } from '@expo/vector-icons'

import orders from '../../../assets/data/orders.json'
import styles from './styles';

const order = orders[0]

const OrderDeliver = () => {

   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["10%", "95%"], [])
   return (
      <View style={styles.container}>
         <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={styles.handleIndicatorStyle}
         >
            <View
               style={styles.handleIndicatorContainer}>
               <Text style={styles.routeDetailsText}>15 min</Text>
               <FontAwesome5
                  name="shopping-bag"
                  size={30}
                  color="#3FC060"
                  style={{ marginHorizontal: 10 }}
               />
               <Text style={styles.routeDetailsText}>5 km</Text>
            </View>

            <View style={styles.deliveryDetailsContainer}>
               <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
               <View style={styles.adressContainer}>
                  <Fontisto name='shopping-store' size={22} color="grey" style={{ marginRight: 5 }}  />
                  <Text style={{ fontSize: 20, color: 'grey', fontWeight: '500', letterSpacing: 0.5 }}>{order.Restaurant.address}</Text>
               </View>

               <View style={{ flexDirection: 'row', marginBottom: 20}}>
                  <FontAwesome5 name="map-marker-alt" size={30} color="grey" style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 20, color: 'grey', fontWeight: '500', letterSpacing: 0.5 }}>{order.User.address}</Text>
               </View>

               <View style={{ borderTopWidth: 1, borderColor: 'lightgrey', paddingTop: 20 }}>
                  <Text style={{ fontSize: 18, color: 'grey', fontWeight: '500', letterSpacing: 0.5, marginBottom: 5 }}>Onion Rings x1</Text>
                  <Text style={{ fontSize: 18, color: 'grey', fontWeight: '500', letterSpacing: 0.5, marginBottom: 5 }} >Big Mac x3</Text>
                  <Text style={{ fontSize: 18, color: 'grey', fontWeight: '500', letterSpacing: 0.5, marginBottom: 5 }} >Big Tasty x2</Text>
                  <Text style={{ fontSize: 18, color: 'grey', fontWeight: '500', letterSpacing: 0.5, marginBottom: 5 }} >Coca-cola x1</Text>
               </View>
            </View>

            <View style={{backgroundColor: '#3FC060', marginTop: 'auto', marginVertical: 20, marginHorizontal: 10, borderRadius: 10}}>
               <Text style={{ color: 'white', paddingVertical: 10, fontSize: 25, fontWeight: '500', textAlign: 'center'}}>Accept Order</Text>
            </View>
         </BottomSheet >
      </View >
   )
}

export default OrderDeliver

