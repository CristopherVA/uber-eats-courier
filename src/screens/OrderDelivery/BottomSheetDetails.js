import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { useOrderContext } from "../../context/OrderContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons"
import styles from "./styles";


const BottomSheetDetails = ({
   totalMin,
   totalKm,
   isDriverClose,
   driverLocation,
   order,
   user,
   dishes,
   acceptOrder,
   pickUpOrder,
   completeOrder,
   mapRef
}) => {

   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])
   const navigation = useNavigation()

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

   return (
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
   )
}

export default BottomSheetDetails;