"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserAuth } from "./_utils/auth-context";
import SignInCard from "./components/signIn-Card";

export default function Page() {
  
  const {user, gitHubSignIn, googleSignIn} = useUserAuth();

  const router= useRouter();

  const handleGoogleSignIn=async()=>{
    try{
      await googleSignIn();
      router.push("/protected");
    }
    catch(error){
      console.error("Error during sign in:", error);
    }
  }

  const handleGitHubSignIn=async()=>{
    try{
      await gitHubSignIn();
      router.push("/protected");
    }
    catch(error){
      console.error("Error during sign in:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 bg-linear-to-br from-purple-200 via-white to-purple-300 p-4">
      {/* Large Logo Section */}
      <div className="md:w-1/3 text-center md:text-left">
        <div className="w-40 h-40 bg-linear-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-xl">
          <Image
            src="/TaskForge(full).png"
            alt="TaskForge Logo"
            width={250}
            height={250}
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="pb-1 text-6xl font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          TaskForge
        </h1>
        <p className="text-purple-600 mt-4 text-xl">Build. Organize. Achieve.</p>
      </div>

      <SignInCard handleGitHubSignIn={handleGitHubSignIn} handleGoogleSignIn={handleGoogleSignIn}/>
      
    </div>
  );
}
