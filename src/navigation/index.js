import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import OrderDeliver from "../screens/OrderDelivery";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuthContext } from "../context/AuthContext";
import { ActivityIndicator } from "react-native";


const Stack = createNativeStackNavigator()

const Navigation = () => {
   const { dbCourier, loading } = useAuthContext();


   if(loading) {
      return  <ActivityIndicator size={"large"} color={"gray"} />
   }

   return (
      <Stack.Navigator
         screenOptions={{
            headerShown: false
         }}
      >
         {dbCourier ? (
            <>
               <Stack.Screen name="OrderScreen" component={OrderScreen} />
               <Stack.Screen name="OrderDelivery" component={OrderDeliver} />
            </>

         ) : (
            <Stack.Screen name="Profile" component={ProfileScreen} />
         )}
      </Stack.Navigator>
   )
};

export default Navigation;