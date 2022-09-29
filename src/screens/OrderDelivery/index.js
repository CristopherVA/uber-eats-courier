import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import { Entypo, MaterialIcons, FontAwesome5, Fontisto, Ionicons } from '@expo/vector-icons'
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location"
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { Order, OrderDish, User } from '../../models';

const ORDER_STATYES = {
   READY_FOR_PICKUP: "READY_FOR_PICKUP",
   ACCEPTED: "ACCEPTED",
   PICKED_UP: "PICKED_UP"
}

const OrderDeliver = () => {
   const [order, setOrder] = useState(null)
   const [user, setUser] = useState(null)
   const [dishItems, setDishItems] = useState([])

   const [driverLocation, setDriverLocation] = useState(null)
   const [totalMin, setTotalMin] = useState(0)
   const [totalKm, setTotalKm] = useState(0)
   const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATYES.READY_FOR_PICKUP)
   const [isDriverClose, setIsDriverClose] = useState(true)
   const mapRef = useRef(null)
   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const navigation = useNavigation()
   const snapPoints = useMemo(() => ["12%", "95%"], [])

   const route = useRoute()
   const id = route.params?.id;

   useEffect(() => {
      if (!id) {
         return;
      }

      DataStore.query(Order, id).then(setOrder)

   }, [id])

   useEffect(() => {
      if (!order) {
         return;
      }
      DataStore.query(User, order.userID).then(setUser);

      DataStore.query(OrderDish, (od) => od.orderID("eq", order.id)).then(setDishItems);
   }, [order])

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


   const onButtonPressed = () => {
      if (deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP) {
         bottomSheetRef.current?.collapse();
         mapRef.current.animateToRegion({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
         })

         setDeliveryStatus(ORDER_STATYES.ACCEPTED);
      }
      if (deliveryStatus === ORDER_STATYES.ACCEPTED) { setDeliveryStatus(ORDER_STATYES.PICKED_UP) }
      if (deliveryStatus === ORDER_STATYES.PICKED_UP) {
         console.warn("Delivery Finished")
         navigation.goBack()
      }
   }

   const renderButtonTitle = () => {
      if (deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP) {
         return "Accept Order"
      }

      if (deliveryStatus === ORDER_STATYES.ACCEPTED) {
         return "Pick-Up Order"
      }

      if (deliveryStatus === ORDER_STATYES.PICKED_UP) {
         return "Complete Delivery"
      }
   }

   const isButtonDisabled = () => {
      if (deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP) {
         return false
      }

      if (deliveryStatus === ORDER_STATYES.ACCEPTED && isDriverClose) {
         return false
      }

      if (deliveryStatus === ORDER_STATYES.PICKED_UP && isDriverClose) {
         return false
      }

      return true
   }

   const restaurantLocation = {
      latitude: order?.Restaurant.lat,
      longitude: order?.Restaurant.lng
   }

   const deliveryLocation = {
      latitude: user?.lat,
      longitude: user?.lng
   }

   if (!driverLocation) {
      return <ActivityIndicator size={"large"} />
   }

   if (!order || !user || !driverLocation) {
      return <ActivityIndicator color={"grey"} size={"large"} />
   }

   console.log({ dishItems });

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
               destination={deliveryStatus === ORDER_STATYES.ACCEPTED ? restaurantLocation : deliveryLocation}
               strokeWidth={10}
               waypoints={deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP ? [restaurantLocation, deliveryLocation] : []}
               strokeColor="#3FC060"
               apikey={"AIzaSyBL_jCIzt9pEeYmcpABj0AeEq4zZpdcyVc"}
               onReady={(result) => {
                  setIsDriverClose(result.distance <= 0.1)
                  setTotalMin(result.duration);
                  setTotalKm(result.distance);
               }}

            />
            <Marker
               coordinate={restaurantLocation}
               title={order.Restaurant.name}
               description={order.Restaurant.address}
            >
               <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
                  <Entypo name='shop' size={30} color="white" />
               </View>
            </Marker>

            <Marker
               coordinate={deliveryLocation}
               title={user.name}
               description={user.address}
            >
               <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
                  <MaterialIcons name='restaurant' size={30} color="white" />
               </View>
            </Marker>
         </MapView>
         {deliveryStatus === ORDER_STATYES.READY_FOR_PICKUP && (
            <Ionicons
               onPress={() => navigation.goBack()}
               name="arrow-back-circle"
               size={42}
               color="black"
               style={{ top: 40, left: 15, position: 'absolute' }}
            />
         )}

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
                  <Text style={styles.adressText}>{user.address}</Text>
               </View>

               <View style={styles.orderDetailsContainer}>
                  {
                     dishItems.map(item => (
                        <Text style={styles.orderItemText} key={item.id}>{item.Dish.name} x{item.quantity}</Text>
                     ))
                  }
                  
               </View>
            </View>

            <Pressable onPress={onButtonPressed} style={{ ...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060' }} disabled={isButtonDisabled()}>
               <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
            </Pressable>
         </BottomSheet >
      </View >
   )
}

export default OrderDeliver

