import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import { DataStore } from 'aws-amplify'
import { User } from '../../models'


const OrderItem = ({ order }) => {

   const navigation = useNavigation()
   const [user, setUser] = useState(null)

   useEffect(() => {
      DataStore.query(User, order.userID).then(setUser)
   }, [])
   

   return (
      <Pressable onPress={() => navigation.navigate("OrderDelivery", {id: order.id})} style={{
         flexDirection: 'row',
         margin: 10,
         borderColor: '#3FC060',
         borderWidth: 2,
         borderRadius: 10,
      }}>
         <Image
            source={{ uri: order.Restaurant?.image }}
            style={{ width: '25%', height: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
         />
         <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>{order.Restaurant?.name}</Text>
            <Text style={{ color: 'grey' }}>{order.Restaurant?.address}</Text>

            <Text style={{ marginTop: 8, fontWeight: '500', fontSize: 16 }}>Delivery Details:</Text>

            <Text style={{ color: 'grey' }}>{order.User?.name}</Text>
            <Text style={{ color: 'grey' }}>{order.User?.address}</Text>
         </View>

         <View
            style={{
               backgroundColor: '#3FC060',
               borderTopRightRadius: 10,
               borderBottomRightRadius: 10,
               justifyContent: 'center', alignItems: "center",
               padding: 5
            }}
         >
            <Entypo
               name='check'
               size={30}
               color="white"
               style={{
                  marginLeft: "auto"
               }}
            />
         </View>
      </Pressable>
   )
}

export default OrderItem