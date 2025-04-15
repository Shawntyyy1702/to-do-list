import { useState } from "react";
import axios from "axios";

export default function AddModal({ hide, onTaskAdded }) {
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState(['']);
    const [message, setMessage] = useState('');

    const addTask = () => {
        setTasks([...tasks, ""]);
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
        
    };

    const handleTaskChange = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    const handleSave = async () => {
        const loggedInUser = localStorage.getItem("username");
    
        if (!loggedInUser) {
            setMessage("❌ No logged-in user found!");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:3000/add-todo", {
                username: loggedInUser,
                title: title,
                list_desc: tasks.filter((task) => task.trim() !== ""), // Remove empty tasks
            });
    
            if (response.data.success) {
                setMessage("✅ Successfully added!");
    
                // Notify parent and pass the new title ID to expand it automatically
                if (onTaskAdded) {
                    onTaskAdded(response.data.newTitleId); // Make sure backend returns newTitleId
                }
    
                setTimeout(() => {
                    hide(); // Close modal after success
                }, 1000);
            }
        } catch (error) {
            setMessage("❌ Error saving task!");
            console.error("Error saving task:", error);
        }
    };
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
            <div className="relative w-[400px] bg-pink-200 p-6 rounded-3xl shadow-lg border-4 border-pink-400">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-pink-700">🎀 Add Task 🎀</h3>
                    <button onClick={hide} className="text-pink-500 hover:text-pink-700 text-xl">✖</button>
                </div>

                
                {message && (
                    <div className={`text-center text-sm font-semibold p-2 rounded-lg mb-3 ${
                        message.includes("✅") ? "text-green-700 bg-green-200" : "text-red-700 bg-red-200"
                    }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-pink-800">Task Title</label>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" className="w-full mt-1 p-2 border border-pink-400 rounded-xl shadow-sm focus:outline-none focus:ring-pink-500" placeholder="Title" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pink-800">Task List</label>
                        <div className="space-y-2">
                            {tasks.map((task, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="text" value={task} onChange={(e) => handleTaskChange(index, e.target.value)} className="p-2 border border-pink-400 rounded-xl w-full" placeholder={`Task ${index + 1}`} />
                                    {tasks.length > 1 && (
                                        <button onClick={() => removeTask(index)} className="px-3 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500">Delete</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={addTask} className="mb-4 w-full px-4 py-2 bg-purple-400 text-white rounded-xl hover:bg-purple-500">➕ Add Task</button>
                    <button onClick={handleSave} className="w-full px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600">💾 Save</button>
                </div>
            </div>
        </div>
    );
}
