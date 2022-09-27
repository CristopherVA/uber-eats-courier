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
   },
   adressText: {
      fontSize: 20,
      color: 'grey',
      fontWeight: '500',
      letterSpacing: 0.5
   },
   orderDetailsContainer: {
      borderTopWidth: 1,
      borderColor: 'lightgrey',
      paddingTop: 20
   },
   orderItemText: {
      fontSize: 18,
      color: 'grey',
      fontWeight: '500',
      letterSpacing: 0.5,
      marginBottom: 5
   },
   buttonContainer: {
      backgroundColor: '#3FC060',
      marginTop: 'auto',
      marginVertical: 30,
      marginHorizontal: 10,
      borderRadius: 10
   },
   buttonText: {
      color: 'white',
      paddingVertical: 10,
      fontSize: 25,
      fontWeight: '500',
      textAlign: 'center'
   }
});

export default styles