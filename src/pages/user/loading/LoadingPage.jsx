import React from "react";
import "./loading.css";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-longer-div"></div>
      <div className="loading-horizontal-div">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <div className="loading-small-div" key={item}></div>
        ))}
      </div>
      <div className="loading-long-div"></div>
      <div className="loading-horizontal-div">
        {[1, 2, 3, 4, 5].map((item) => (
          <div className="loading-medium-div" key={item}></div>
        ))}
      </div>
      <div className="loading-sharper-div"></div>
      <div className="loading-horizontal-div">
        {[1, 2, 3, 4].map((item) => (
          <div className="loading-large-div" key={item}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
