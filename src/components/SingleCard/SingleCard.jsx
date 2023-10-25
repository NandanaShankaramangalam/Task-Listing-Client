import React from "react";

const SingleCard = ({ setIsSingleCard, cardData }) => {
  return (
    <div>
      <div className="fixed inset-20 flex justify-center h-96 z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-1/3 border border-solid">
          <div>
            <div className="flex justify-end mb-5">
              <button>
                <i
                  className="fa-solid fa-xmark text-lg"
                  onClick={() => setIsSingleCard(false)}
                  style={{ position: "absolute", top: 7, right: 420 }}
                ></i>
              </button>
            </div>
          </div>
          <div>
            <img
              className="h-2/4 w-full"
              src={cardData.image}
              alt="Task Image"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">{cardData.heading}</p>
          </div>
          <div>
            <p className="text-md">{cardData.description}</p>
          </div>
          <div>
            <p className="text-xs">
              Task added date :{" "}
              {cardData.date
                ? new Date(cardData.date).toISOString().split("T")[0]
                : ""}
            </p>
          </div>
          <div>
            <p className="text-xs">
              Task added time :{" "}
              {cardData.time ? cardData.time.substr(11, 8) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
