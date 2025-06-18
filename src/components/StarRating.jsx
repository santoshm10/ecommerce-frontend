import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Using Font Awesome icons

const StarRating = ({ rating }) => {
  const maxStars = 5;

  return (
    <div>
      {[...Array(maxStars)].map((_, index) => {
        return (
          <span key={index} style={{ color: "#FFD700", fontSize: "20px" }}>
            {index < rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
