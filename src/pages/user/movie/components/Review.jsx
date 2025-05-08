import React from "react";

const Review = ({ review }) => {
  return (
    <div className="review">
      <div className="review-user-div">
        <img
          src={review.user.gender === "M" ? "/boy.png" : "/girl.png"}
          width={40}
          alt=""
        />
        <h4 className="review-username">{review.user.username}</h4>
      </div>

      <h4 className="review-review">{review.review}</h4>
    </div>
  );
};

export default Review;
