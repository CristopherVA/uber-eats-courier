import { useRef } from 'react'
import { View, Text } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';

const OrderScreen = () => {

   const bottomSheetRef = useRef(null);

   return (
      <View style={{ backgroundColor: 'lightblue', flex: 1}}>
         <BottomSheet ref={bottomSheetRef} snapPoints={["12%", "95%"]} >
            <View style={{flex: 1}}>
               <Text>Hello</Text>
            </View>
         </BottomSheet>
      </View>
   )
}

export default OrderScreen