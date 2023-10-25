import React, { useState } from "react";
import axios from "axios";
const EditCard = ({
  editData,
  setEditData,
  cardData,
  setIsEdit,
  fetchData,
  id,
}) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState({});
  const [formData, setFormData] = useState({
    heading: editData.heading,
    description: editData.description,
    date: editData.date,
    priority: editData.priority,
    image: editData.image,
  });

  let imgFile;
  const handleFileChange = (e) => {
    imgFile = e.target.files?.[0];
    if (imgFile) {
      uploadImg(imgFile);
    } else {
      console.log("nulll");
    }
  };

  const uploadImg = async () => {
    setIsLoading(true);
    const img = new FormData();
    img.append("file", imgFile);
    img.append("upload_preset", "tasklist");
    img.append("cloud_name", `${process.env.REACT_APP_CLOUD_NAME}`);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      img
    );
    console.log("img url =", data);
    setImgUrl(data.url);
    setIsLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("forrrmmm=", formData, imgUrl);
    const formattedDate = new Date(formData.date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const { data } = await axios.put("http://localhost:3001/edit-task", {
      ...formData,
      imageUrl: imgUrl,
      id,
      formattedDate: formattedDate,
    });
    console.log("Submitted datas =", data);
    setIsEdit(false);
    fetchData();
  };
  return (
    <div className={`fixed inset-0 flex justify-center items-center mt-5 z-50`}>
      <div className="h-auto w-96 border border-solid border-gray-300 bg-white">
        <form className="w-full max-w-md mx-auto p-3 pt-1">
          <div className="relative mb-10">
            <button
              className="absolute top-0 right-0 p-2 text-gray-600 hover:text-red-600 focus:outline-none"
              aria-label="Close"
              onClick={() => setIsEdit(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="heading"
              name="heading"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Heading"
              value={formData.heading}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              id="description"
              cols="30"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter description..."
              rows="5"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>

          <div className="mb-4">
            <input
              type="date"
              id="date"
              name="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="relative mb-4">
            <select
              name="priority"
              id="priority"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.priority}
              onChange={handleFormChange}
            >
              <option value={""}>Select Priority</option>
              <option value={"Low"}>Low</option>
              <option value={"Medium"}>Medium</option>
              <option value={"High"}>High</option>
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

          {isLoading && (
            <div className="mb-4">
              <section class="dots-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </section>
            </div>
          )}

          {imgUrl ? (
            <div className="mb-4" style={{ position: "relative" }}>
              <i
                className="fa-solid fa-xmark"
                onClick={() => setImgUrl(null)}
                style={{ position: "absolute", top: 0, right: 255 }}
              ></i>
              <img src={imgUrl} alt="" className="h-20 w-20" />
            </div>
          ) : (
            <div className="mb-4 mt-2" style={{ position: "relative" }}>
              <label htmlFor="file_upload" className="cursor-pointer">
                <i
                  className="fa-solid fa-pen-to-square"
                  style={{ position: "absolute", top: 3, right: 255 }}
                ></i>
              </label>
              <input
                type="file"
                id="file_upload"
                accept="image/*"
                name="image"
                className="hidden shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleFileChange}
                required
              />
              <img src={formData.image} alt="" className="h-20 w-20" />
            </div>
          )}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCard;
