import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from 'aws-amplify'
import { Courier, TransportationModes, User } from "../../models";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

const ProfileScreen = () => {

  const { dbCourier, sub, setDbCourier } = useAuthContext()
  const [name, setName] = useState(dbCourier?.name || "");
  const [transportationMode, setTransportationMode] = useState(TransportationModes.DRIVING)
  const navigation = useNavigation()
  console.log({ dbCourier })

  const onSave = async () => {
    if (dbCourier) {
      await updateCourier()
    } else {
      await createCourier()
    }
    navigation.goBack();
  };

  const createCourier = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          lat: 0,
          lng: 0,
          sub,
          transportationMode
        }))
      setDbCourier(courier)

    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const updateCourier = async () => {
    const courier = await DataStore.save(
      Courier.copyOf(dbCourier, (update) => {
        update.name = name;
        update.lat = parseFloat(lat);
        update.lng = parseFloat(lng);
        update.transportationMode = transportationMode;
      })
    );
    setDbCourier(courier)
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <View style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={{
            backgroundColor: transportationMode === TransportationModes.BICYCLING ? "#3FC060" : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "grey",
            borderRadius: 10
          }}>
          <MaterialIcons
            name="pedal-bike"
            size={40}
            color="black"
          />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={{
            backgroundColor: transportationMode === TransportationModes.DRIVING ? "#3FC060" : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "grey",
            borderRadius: 10
          }}>
          <FontAwesome5
            name="car"
            size={40}
            color="black"
          />
        </Pressable>
      </View>


      <Button style={{ marginButton: 10 }} onPress={() => onSave()} title="Save" />
      <Text onPressIn={() => Auth.signOut()} style={{ textAlign: 'center', color: 'red', margin: 10 }} onPress={() => onSave()}  >Sign out</Text>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },

});

export default ProfileScreen;
