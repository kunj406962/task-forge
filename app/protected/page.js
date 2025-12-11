"use client";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";

export default function Page(){
    const{user, firebaseSignOut }=useUserAuth();  
    
    const router=useRouter();

    const logout=async()=>{
        await firebaseSignOut();
        router.push("/");
    }

    return(
        !user ? (
            <h1>You have to sign in to access this page</h1>
        ) : (
            <div>
                <h1>Welcome {user.displayName}</h1>
                <button onClick={logout}>Sign Out</button>
            </div>
        )
    );
}