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
import { Order, OrderDish, OrderStatus, User } from '../../models';
import { useOrderContext } from '../../context/OrderContext';

// const ORDER_STATYES = {
//    READY_FOR_PICKUP: "READY_FOR_PICKUP",
//    ACCEPTED: "ACCEPTED",
//    PICKED_UP: "PICKED_UP"
// }

const OrderDeliver = () => {

   const { order, user, dishes, acceptOrder, fetchOrder, pickUpOrder, completeOrder } = useOrderContext()
   const [driverLocation, setDriverLocation] = useState(null)
   const [totalMin, setTotalMin] = useState(0)
   const [totalKm, setTotalKm] = useState(0)
   const [isDriverClose, setIsDriverClose] = useState(true)


   const mapRef = useRef(null)
   const { width, height } = useWindowDimensions()
   const bottomSheetRef = useRef(null);
   const navigation = useNavigation()
   const snapPoints = useMemo(() => ["12%", "95%"], [])

   const route = useRoute()
   const id = route.params?.id;

   useEffect(() => {
      fetchOrder(id)
   }, [id])

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


   const onButtonPressed = async () => {
      if (order.status === "READY_FOR_PICKUP") {
         bottomSheetRef.current?.collapse();
         mapRef.current.animateToRegion({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
         })
         acceptOrder()
      }
      if (order.status === "ACCEPTED") {
         setDeliveryStatus(ORDER_STATYES.PICKED_UP)
         pickUpOrder()
      }
      if (order.status === "PICKED_UP") {
         await completeOrder()
         navigation.goBack()
      }
   }

   const renderButtonTitle = () => {
      if (order.status === "READY_FOR_PICKUP") {
         return "Accept Order"
      }

      if (order.status === "ACCEPTED") {
         return "Pick-Up Order"
      }

      if (order.status === "PICKED_UP") {
         return "Complete Delivery"
      }
   }

   const isButtonDisabled = () => {
      if (order.status === "READY_FOR_PICKUP") {
         return false
      }

      if (order.status === "ACCEPTED" && isDriverClose) {
         return false
      }

      if (order.status === "PICKED_UP" && isDriverClose) {
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

   if (!order || !driverLocation) {
      return <ActivityIndicator color={"grey"} size={"large"} />
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
               destination={order.status === "ACCEPTED" ? restaurantLocation : deliveryLocation}
               strokeWidth={10}
               waypoints={order.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []}
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
               title={user?.name}
               description={user?.address}
            >
               <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
                  <MaterialIcons name='restaurant' size={30} color="white" />
               </View>
            </Marker>
         </MapView>
         {order.status === "READY_FOR_PICKUP" && (
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
                  <Text style={styles.adressText}>{user?.address}</Text>
               </View>

               <View style={styles.orderDetailsContainer}>
                  {
                     dishes?.map(item => (
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

