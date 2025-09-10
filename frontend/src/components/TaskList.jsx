import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      alert('Failed to delete task.');
    }
  };

  console.log(tasks);
  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{task.title}</h2>
          <p>Amount of Shares: {task.description}</p>
          <p className = "text-sm text-gray-500"> Price per Share: {task.price}</p>
          {console.log(tasks)}
          <p className = "text-sm text-gray-500"> Purchase Date: {new Date(task.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              View
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sell
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
