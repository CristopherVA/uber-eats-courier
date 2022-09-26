import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrderScreen";
import OrderDeliver from "../screens/OrderDelivery";

const Stack = createNativeStackNavigator()

const Navigation = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerShown: false
         }}
      >
         <Stack.Screen name="OrderScreen" component={OrderScreen} />
         <Stack.Screen name="OrderDelivery" component={OrderDeliver} />
      </Stack.Navigator>
   )
};

export default Navigation;