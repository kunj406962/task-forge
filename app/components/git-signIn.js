import {FaGithub} from "react-icons/fa";

export default function GitSignIn({handleSignIn}) {

  return (
    <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-4xl">
        <button
            onClick={handleSignIn}
            className="flex items-center justify-center gap-3 w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white font-medium py-3 px-6 rounded-4xl transition-all hover:scale-[1.02]"
        >
            <FaGithub className="w-5 h-5" />
            Sign in with GitHub
        </button>
    </div>
  );
}