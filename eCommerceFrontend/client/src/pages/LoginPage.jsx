// import { GoogleLogin } from "@react-oauth/google";
// import { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { motion, AnimatePresence } from "framer-motion"; // Optional for smoother transitions

// export default function LoginPage() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [contact, setContact] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const payload = { contact: contact.trim(), password };

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       login(data.token, data.user);
//       navigate("/");
//     } catch (err) {
//       setErrorMsg(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async (response) => {
//     setErrorMsg("");
//     setGoogleLoading(true);

//     try {
//       const token = response.credential;

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/v1/auth/google-login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ credential: token }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       login(data.token, data.user);
//       // Add slight delay to show loading spinner
//       setTimeout(() => navigate("/"), 500);
//     } catch (err) {
//       setErrorMsg(err.message || "Google login failed");
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       {/* Loading Overlay for Google */}
//       <AnimatePresence>
//         {(googleLoading || loading) && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.85 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-white flex items-center justify-center"
//           >
//             <div className="text-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="text-blue-600 text-lg font-medium">
//                 {googleLoading ? "Signing in with Google..." : "Logging in..."}
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Card */}
//       <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl text-center max-w-lg w-full space-y-8 border border-gray-200 z-10">
//         <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
//           Welcome Back!
//         </h2>

//         {errorMsg && (
//           <p className="text-red-600 bg-red-100 border border-red-200 rounded-md py-2 px-4 text-sm">
//             {errorMsg}
//           </p>
//         )}

//         <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
//           <input
//             type="text"
//             name="contact"
//             placeholder="Email or Mobile Number"
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//             className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
//             required
//             disabled={googleLoading}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
//             required
//             disabled={googleLoading}
//           />

//           <div className="flex justify-end text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-blue-600 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading || googleLoading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-base"
//           >
//             {loading ? "Logging in..." : "Login Securely"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative flex items-center py-4">
//           <div className="flex-grow border-t border-gray-300"></div>
//           <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
//           <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         {/* Google Login */}
//         <div className="flex justify-center">
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => {
//               setErrorMsg("Google login failed. Please try again.");
//               setGoogleLoading(false);
//             }}
//             disabled={googleLoading}
//             size="large"
//             theme="filled_blue"
//           />
//         </div>

//         <p className="text-gray-600 text-sm mt-4">
//           Don&apos;t have an account?{" "}
//           <Link to="/register" className="text-blue-600 font-medium">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { GoogleLogin } from "@react-oauth/google";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const { login, api } = useContext(AuthContext);
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = { contact: contact.trim(), password };
      const { data } = await api.post("/api/v1/auth/login", payload);

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      const token = response.credential;
      const { data } = await api.post("/api/v1/auth/google-login", {
        credential: token,
      });

      login(data.token, data.user);
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <AnimatePresence>
        {(googleLoading || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-blue-600 text-lg font-medium">
                {googleLoading ? "Signing in with Google..." : "Logging in..."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl text-center max-w-lg w-full space-y-8 border border-gray-200 z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Welcome Back!
        </h2>

        {errorMsg && (
          <p className="text-red-600 bg-red-100 border border-red-200 rounded-md py-2 px-4 text-sm">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <input
            type="text"
            name="contact"
            placeholder="Email or Mobile Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
            required
            disabled={googleLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
            required
            disabled={googleLoading}
          />

          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-base"
          >
            {loading ? "Logging in..." : "Login Securely"}
          </button>
        </form>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              setErrorMsg("Google login failed. Please try again.");
              setGoogleLoading(false);
            }}
            disabled={googleLoading}
            size="large"
            theme="filled_blue"
          />
        </div>

        <p className="text-gray-600 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
