import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import OrderDeliver from "../screens/OrderDelivery";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuthContext } from "../context/AuthContext";


const Stack = createNativeStackNavigator()

const Navigation = () => {
   const { dbCourier } = useAuthContext();
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