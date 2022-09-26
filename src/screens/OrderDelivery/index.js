import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from "expo-location"
import { FontAwesome5, Fontisto } from '@expo/vector-icons'

import orders from '../../../assets/data/orders.json'
import styles from './styles';
import MapView, { Marker } from 'react-native-maps';

const order = orders[0]

const OrderDeliver = () => {

   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["20%", "95%"], [])



   return (
      <View style={styles.container}>
         <MapView
            style={{ width: width, height: height }}
            showsUserLocation
            followsUserLocation
         >

         </MapView>
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
                  <Fontisto name='shopping-store' size={22} color="grey" style={{ marginRight: 5 }} />
                  <Text style={styles.adressText}>{order.Restaurant.address}</Text>
               </View>

               <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                  <FontAwesome5 name="map-marker-alt" size={30} color="grey" style={{ marginRight: 5 }} />
                  <Text style={styles.adressText}>{order.User.address}</Text>
               </View>

               <View style={styles.orderDetailsContainer}>
                  <Text style={styles.orderItemText}>Onion Rings x1</Text>
                  <Text style={styles.orderItemText} >Big Mac x3</Text>
                  <Text style={styles.orderItemText} >Big Tasty x2</Text>
                  <Text style={styles.orderItemText} >Coca-cola x1</Text>
               </View>
            </View>

            <View style={styles.buttonContainer}>
               <Text style={styles.buttonText}>Accept Order</Text>
            </View>
         </BottomSheet >
      </View >
   )
}

export default OrderDeliver

