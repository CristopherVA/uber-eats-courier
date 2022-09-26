import { useMemo, useRef } from 'react'
import { FlatList, View, Text } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import orders from '../../../assets/data/orders.json';

// components
import OrderItem from '../../components/OrderItem';


const OrderScreen = () => {

   const bottomSheetRef = useRef(null);
   const snapPoints = useMemo(() => ["12%", "95%"], [])

   return (
      <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
         <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >
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
      </View>
   )
}

export default OrderScreen