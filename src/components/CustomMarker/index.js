import { View } from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons"
import { Marker } from "react-native-maps";

const CustomMarker = ({ data, type }) => {
   return (
      <Marker
         coordinate={{
            latitude: data.lat,
            longitude: data.lng
         }}
         title={data.name}
         description={data.address}
      >
         <View style={{ backgroundColor: 'green', borderRadius: 25, padding: 5 }}>
            {type === "RESTAURANT"
               ? (<Entypo name='shop' size={30} color="white" />)
               : (<MaterialIcons name='restaurant' size={30} color="white" />)
            }
         </View>
      </Marker>
   )
}

export default CustomMarker;