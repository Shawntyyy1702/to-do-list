import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/check-accounts', { username, password });
      if (response.data.exit) {
        localStorage.setItem("username", username); // ✅ Store username in localStorage
        setShowError(false);
        navigate('/todo');
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-pink-300">
      <div className="w-xl h-[550px] bg-pink-200 flex flex-col justify-center p-8 gap-6 rounded-3xl shadow-lg border-4 border-pink-400">
        <h1 className="text-4xl text-center font-bold text-pink-700 mb-2">💕 LOGIN 💕</h1>
        
        {showError && (
          <div className="bg-pink-400 text-white p-3 rounded-lg font-medium shadow-md">
            Invalid username or password
          </div>
        )}
        
        <div className="flex flex-col">
          <label htmlFor="username" className="text-pink-800 font-medium">Username:</label>
          <input type="text" className="outline-none border-2 border-pink-400 p-2 rounded-xl focus:ring-2 focus:ring-pink-500 bg-pink-100"
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="password" className="text-pink-800 font-medium">Password:</label>
          <input type="password" className="outline-none border-2 border-pink-400 p-2 rounded-xl focus:ring-2 focus:ring-pink-500 bg-pink-100"
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        
        <button type="button" onClick={handleLogin} className="bg-pink-600 text-white py-3 font-medium text-xl rounded-xl shadow-md hover:bg-pink-700">
          🎀 LOGIN 🎀
        </button>
      </div>
    </div>
  );
}

export default App;
