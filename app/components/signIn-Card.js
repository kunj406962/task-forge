"use client";
import GitSignIn from "./git-signIn";
import GoogleSignIn from "./google-signIn";

export default function SignInCard({handleGitHubSignIn, handleGoogleSignIn}) {

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-purple-300">
        <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Welcome
            </h1>
        </div>
    
        {/* Sign In Options */}
        <div className="space-y-1">

            <GoogleSignIn handleSignIn={handleGoogleSignIn} />
              
            {/* Divider with lavender accent */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-purple-600 font-medium">
                        Or continue with GitHub
                    </span>
                </div>
            </div>

            <GitSignIn handleSignIn={handleGitHubSignIn} />       
    
        </div>
    </div>
  );
}
