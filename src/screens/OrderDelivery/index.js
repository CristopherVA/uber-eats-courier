import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
// import BottomSheet from 'react-native-simple-bottom-sheet'
import { Entypo, MaterialIcons, FontAwesome5, Fontisto } from '@expo/vector-icons'
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location"
import styles from './styles';

import orders from '../../../assets/data/orders.json'

const order = orders[0]


const ORDER_STATYES = {
   READY_FOR_PICKUP: "READY_FOR_PICKUP",
   ACCEPTED: "ACCEPTED",
   PICKED_UP: "PICKED_UP"
}

const OrderDeliver = () => {
   const [driverLocation, setDriverLocation] = useState(null)
   const [totalMin, setTotalMin] = useState(0)
   const [totalKm, setTotalKm] = useState(0)
   const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATYES.READY_FOR_PICKUP)
   const [isDriverClose, setIsDriverClose] = useState(false)
   const mapRef = useRef(null)
   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);

   const snapPoints = useMemo(() => ["12%", "95%"], [])



   useEffect(() => {
      (async () => {

         let { status } = await Location.requestForegroundPermissionsAsync()
         if (!status == "granted") {
            console.log('NONONO');
            return;
         }

         let location = await Location.getCurrentPositionAsync()

         setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
         });
      })()

      const foregroundSubscription = Location.watchPositionAsync(
         {
            accuracy: Location.Accuracy.High,
            distanceInterval: 100
         }, (updatedLocation) => {
            setDriverLocation({
               latitude: updatedLocation.coords.latitude,
               longitude: updatedLocation.coords.longitude
            })
         }
      )

      return foregroundSubscription;

   }, [])


   if (!driverLocation) {
      return <ActivityIndicator size={"large"} />
   }

   const onButtonPressed = () => {
      if(deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP){
         bottomSheetRef.current?.collapse();
         mapRef.current.animateToRegion({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
         })

         setDeliveryStatus(ORDER_STATYES.ACCEPTED);
      }
      if ( deliveryStatus === ORDER_STATYES.ACCEPTED ) { setDeliveryStatus(ORDER_STATYES.PICKED_UP) }
      if ( deliveryStatus === ORDER_STATYES.PICKED_UP ) { console.warn("Delivery Finished") }
   }

   const renderButtonTitle = () => {
      if(deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP){
         return "Accept Order"
      }

      if(deliveryStatus === ORDER_STATYES.ACCEPTED){
         return "Pick-Up Order"
      }

      if(deliveryStatus === ORDER_STATYES.PICKED_UP){
         return "Complete Delivery"
      }
   }

   const isButtonDisabled = () => {
      if(deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP) {
         return false
      }

      if(deliveryStatus === ORDER_STATYES.ACCEPTED && isDriverClose){
         return false
      }

      if(deliveryStatus ===  ORDER_STATYES.PICKED_UP && isDriverClose){
         return false
      }

      return true
   }

   return (
      <View style={styles.container}>
         <MapView
            ref={mapRef}
            style={{ width: width, height: height }}
            showsUserLocation
            followsUserLocation
            initialRegion={{
               latitude: driverLocation?.latitude,
               longitude: driverLocation?.longitude,
               latitudeDelta: 0.07,
               longitudeDelta: 0.07
            }}
         >
            <MapViewDirections
               origin={driverLocation}
               destination={deliveryStatus === ORDER_STATYES.ACCEPTED ? { latitude: order.Restaurant.lat, longitude: order.Restaurant.lng } : { latitude: order.User.lat, longitude: order.User.lng } }
               strokeWidth={10}
               waypoints={deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP ? 
                  [{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }] : []
               }
               strokeColor="#3FC060"
               apikey={"AIzaSyBL_jCIzt9pEeYmcpABj0AeEq4zZpdcyVc"}
               onReady={(result) => {
                  if(result.distance <= 0.1){
                     return setIsDriverClose(true)
                  }
                  setTotalMin(result.duration);
                  setTotalKm(result.distance);
               }}

            />
            <Marker
               coordinate={{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }}
               title={order.Restaurant.name}
               description={order.Restaurant.address}
            >
               <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
                  <Entypo name='shop' size={30} color="white" />
               </View>
            </Marker>

            <Marker
               coordinate={{ latitude: order.User.lat, longitude: order.User.lng }}
               title={order.User.name}
               description={order.User.address}
            >
               <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
                  <MaterialIcons name='restaurant' size={30} color="white" />
               </View>
            </Marker>
         </MapView>
         <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            handleIndicatorStyle={styles.handleIndicatorStyle}
         >
            <View
               style={styles.handleIndicatorContainer}>
               <Text style={styles.routeDetailsText}>{totalMin.toFixed(0)} min</Text>
               <FontAwesome5
                  name="shopping-bag"
                  size={30}
                  color="#3FC060"
                  style={{ marginHorizontal: 10 }}
               />
               <Text style={styles.routeDetailsText}>{totalKm.toFixed(1)} km</Text>
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

            <Pressable onPress={onButtonPressed}  style={{...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060'}} disabled={isButtonDisabled}>
               <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
            </Pressable>
         </BottomSheet >
      </View >
   )
}

export default OrderDeliver

