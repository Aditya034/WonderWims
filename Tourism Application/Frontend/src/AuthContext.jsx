import { createContext, useContext, useState } from "react";
import { Children } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [user,setUser] = useState(null);
    const navigate = useNavigate();
    console.log("User ",user)

    const login = async (email, password) => {
        try {
            const response = await fetch("http://127.0.0.1:8443/users/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            const r = await response.json();
            const status = response.status;
            
            if (status === 200) { // Assuming 200 is the success status code
                document.cookie = "token=" + r.jwt + "; expires=" + 86400;
                localStorage.setItem("userId", r.userId);
                setUser({ userId: r.userId, role: r.role });

                // Navigate based on the user role
                if (r.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
                
                return { success: true, jwt: r.jwt, userId: r.userId, userRole: r.role };
            } else {
                console.error("Login failed:", r.message);
                return { success: false, message: r.message };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.message };
        }
    };

    const logout =async(navigate)=>{
        console.log("Handle logout clicked");
        const expiryDate = new Date(Date.now() + 0 * 1000);
        document.cookie = `token=;expires=${expiryDate.toUTCString()}`;
        localStorage.clear();
        setUser(null)
        navigate("/signup")
    }

    const fetchuserBookings = async(data,setData)=>{
        const userId = localStorage.getItem("userId")
        
        const listData = [];
        console.log(document.cookie.split('='))
        let co = document.cookie.split('=')[1]
    
        const response = await fetch(`http://127.0.0.1:8443/v2/bookings/user/${userId}`,{
            method:"GET",
            headers: {
                Authorization: `Bearer ${co}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },

        });
    
        const user_data = await response.json();
        
        console.log({user_data});
    
        for(const i of user_data.rows){
            console.log({i})
            const response2 = await fetch(`http://127.0.0.1:3000/get/${i.booked_state_id}`);
    
            const location_data = await response2.json();
            listData.push(location_data.data);
        }
        console.log({listData})
        setData(listData);
    
    }
    
    async function removeBooking( id ) {
      const response = await fetch(`http://127.0.0.1:3000/removeBooking/${id}`,{
        method:"POST"
      });
    
      const data = await response.json();
    
      
    
    
    }

    return (
        <AuthContext.Provider value={{user,login,logout,fetchuserBookings,removeBooking}}>
            {children}
        </AuthContext.Provider>
    )
    
}


export const useAuth = ()=>useContext(AuthContext);