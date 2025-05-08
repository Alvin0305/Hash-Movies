import React from "react";

const Review = ({ review }) => {
  return (
    <div>
      <h4>{review.user.username}</h4>
      <h4>{review.review}</h4>
    </div>
  );
};

export default Review;
