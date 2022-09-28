import { createContext, useContext, useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({})

const AuthContextProvider = ({ children }) => {

   const [authUser, setAuthUser] = useState(null)
   const [dbCourier, setDbCourier] = useState(null)


   const sub = authUser?.attributes?.sub;
   console.log({ sub })

   useEffect(() => {
      Auth.currentAuthenticatedUser({ bypassCache: true }).then((res) => {
         console.log({ res })
         setAuthUser(res)
      })
   }, [])

   useEffect(() => {
      DataStore.query(Courier, (courier) => courier.sub('eq', sub)).then((couriers) => {
         setDbCourier(couriers[0])
      })
   }, [sub])
   
   console.log("AAAAAAAAAAAAA");
   console.log({ dbCourier });

   return (
      <AuthContext.Provider value={{ authUser, dbCourier, sub, setDbCourier }}>
         {children}
      </AuthContext.Provider>
   )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)