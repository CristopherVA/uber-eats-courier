import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
   container: {
      backgroundColor: 'lightblue',
      flex: 1
   },
   handleIndicatorStyle: {
      backgroundColor: 'grey',
      width: 100
   },
   handleIndicatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 20
   },
   routeDetailsText: {
      fontSize: 25,
      letterSpacing: 1
   },
   deliveryDetailsContainer: {
      paddingHorizontal: 20
   },
   restaurantName: {
      fontSize: 25,
      letterSpacing: 1,
      paddingVertical: 20
   },
   adressContainer: {
      flexDirection: 'row',
      marginBottom: 20
   }
});

export default styles