import { DataStore } from "aws-amplify";
import { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderDish, User } from "../models";
import { useAuthContext } from "./AuthContext"

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
   const { activeOrder, setActiveOrder } = useState();
   const { dbCourier } = useAuthContext();
   const [order, setOrder] = useState();
   const [user, setUser] = useState();
   const [dishes, setDishes] = useState()

   const fetchOrder = async (id) => {
      if (!id) {
         setOrder(null)
         return;
      }

      const fetchedOrder = await DataStore.query(Order, id)
      setOrder(fetchedOrder)

      DataStore.query(User, fetchedOrder.userID).then(setUser)

      DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id))
         .then(setDishes)

   }

   const acceptOrder = () => {
      // update the order, and change status, and assign the courier
      DataStore.save(
         Order.copyOf(order, (updated) => {
            updated.status = "ACCEPTED";
            updated.Courier = dbCourier;
         })
      ).then(setOrder)
   }

   const pickUpOrder = () => {
      // update the order, and change status, and assign the courier
      DataStore.save(
         Order.copyOf(order, (updated) => {
            updated.status = "PICKED_UP";
         })
      ).then(setOrder)
   }

   const completeOrder = () => {
      // update the order, and change status, and assign the courier
      DataStore.save(
         Order.copyOf(order, (updated) => {
            updated.status = "COMPLETED";
            updated.Courier = dbCourier;
         })
      ).then(setOrder)
   }

   return (
      <OrderContext.Provider value={{ order, user, dishes, acceptOrder, fetchOrder, pickUpOrder, completeOrder }}>
         {children}
      </OrderContext.Provider>
   )
}
export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)