import React, { useEffect, useState } from "react";
import AddTask from "../AddNewTask/AddTask";
import axios from "axios";
import SingleCard from "../SingleCard/SingleCard";
import EditCard from "../EditCard/EditCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [isSingleCard, setIsSingleCard] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setTaskId] = useState();
  const [cardData, setCardData] = useState({
    image: "",
    heading: "",
  });
  const [editData, setEditData] = useState({});
  const [priority, setPriority] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [priority]);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/");
      console.log("Response from data fetch:", response.data.data);
      if (response.data && response.data.data) {
        setTaskData(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  const handleSingleCardData = (image, heading, description, date, time) => {
    setIsSingleCard(true);
    setCardData({
      image: image,
      heading,
      heading,
      description: description,
      date: date,
      time: time,
    });
  };

  const handleDelete = async (taskId) => {
    try {
      console.log("deletinggggg...", taskId);
      await axios.post("http://localhost:3001/delete", { id: taskId }).then((data)=>{
        notify();
      });
      const updatedData = taskData.filter((task) => task.id !== taskId);
      setTaskData(updatedData);
    } catch (error) {
      console.error("Error occurred while deleting data:", error);
    }
  };

  const handleEdit = (
    taskId,
    image,
    heading,
    description,
    date,
    time,
    priority
  ) => {
    setIsEdit(true);
    setTaskId(taskId);
    setEditData({
      taskId: taskId,
      image: image,
      heading,
      heading,
      description: description,
      date: date,
      time: time,
      priority: priority,
    });
  };

  const handleFilter = async () => {
    try {
      console.log("priiiiiiiiiiii=", priority);
      const response = await axios.post(
        "http://localhost:3001/filter-task",
        priority
      );
      console.log("Response from priority fetch:", response.data.data);
      if (response.data && response.data.data) {
        setTaskData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePriority = (e) => {
    setPriority({ ...priority, [e.target.name]: e.target.value });
  };

  const notify = () => toast("Task deleted!");
  return (
    <div>
      <div className="flex justify-center mt-5">
        <button
          className="p-2 pe-3 ps-3 border-none bg-indigo-950 text-white rounded-xl hover:bg-indigo-900"
          onClick={() => setIsOpen(true)}
        >
          New Task
        </button>
      </div>
      <div className="flex justify-end mr-5">
        <div className="relative mb-4">
          <select
            name="priority"
            id="priority"
            className="shadow appearance-none border rounded  py-2 px-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handlePriority}
          >
            <option value={""} disabled selected hidden>
              Filter
            </option>
            <option value={"Low"}>Low</option>
            <option value={"Medium"}>Medium</option>
            <option value={"High"}>High</option>
            <option value={"All"}>All</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 13.293l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && <AddTask setIsOpen={setIsOpen} fetchData={fetchData} />}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
        {taskData.map((item) => (
          <div className="p-5">
            <div className="p-4 border rounded-lg shadow-md">
              <img
                src={item.image}
                alt=""
                onClick={() =>
                  handleSingleCardData(
                    item.image,
                    item.heading,
                    item.description,
                    item.date,
                    item.time
                  )
                }
              />
              <div className="flex justify-center mt-1">
                <h1 className="font-semibold">{item.heading}</h1>
              </div>
              <div className="flex justify-end mt-2">
                <i
                  className="fa-solid fa-pen-to-square"
                  onClick={() =>
                    handleEdit(
                      item.id,
                      item.image,
                      item.heading,
                      item.description,
                      item.date,
                      item.time,
                      item.priority
                    )
                  }
                ></i>
                <i
                  className="fa-solid fa-trash ml-2"
                  onClick={() => handleDelete(item.id)}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isSingleCard && (
        <SingleCard setIsSingleCard={setIsSingleCard} cardData={cardData} />
      )}
      {isEdit && (
        <EditCard
          editData={editData}
          setEditData={setEditData}
          cardData={cardData}
          setIsEdit={setIsEdit}
          fetchData={fetchData}
          id={id}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
