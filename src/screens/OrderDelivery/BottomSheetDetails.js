import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { useOrderContext } from "../../context/OrderContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons"
import styles from "./styles";

const STATUS_TO_TITLE = {
   READY_FOR_PICKUP: "Accept Order",
   ACCEPTED: "Pick-Up Order",
   PICKED_UP: "Complete Delivery"
}


const BottomSheetDetails = ({
   totalMin,
   totalKm,
   onAccepted
}) => {

   const isDriverClose = totalKm <= 1

   const { order, user, dishes, acceptOrder, pickUpOrder, completeOrder } = useOrderContext()

   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])
   const navigation = useNavigation()

   const onButtonPressed = async () => {

      const { status } = order;

      if (status === "READY_FOR_PICKUP") {
         bottomSheetRef.current?.collapse();
         await acceptOrder()
         onAccepted()
      } else if (status === "ACCEPTED") {
         setDeliveryStatus(ORDER_STATYES.PICKED_UP)
         await pickUpOrder()
      } else if (status === "PICKED_UP") {
         await completeOrder()
         navigation.goBack()
      }
   }


   const isButtonDisabled = () => {

      const { status } = order

      if (order.status === "READY_FOR_PICKUP") return false;

      if ((status === "ACCEPTED" || status === "PICKED_UP") && isDriverClose) return false;

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
            <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>
         </Pressable>
      </BottomSheet >
   )
}

export default BottomSheetDetails;