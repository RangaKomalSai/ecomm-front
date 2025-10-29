import React from "react";

const TopBanner = () => {
  return (
    <div className="top-banner w-screen -ml-[calc(50vw-50%)]">
      <div
        className="marquee-wrap w-screen bg-[#3d2b1f] text-white py-2"
        role="region"
        aria-label="Site promotion"
        tabIndex={0}
      >
        <div className="marquee">
          <div className="marquee__inner">
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
          </div>
          <div className="marquee__inner" aria-hidden="true">
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
            <span className="mx-8 font-semibold">Use WELCOME50 to get 50% off on your first order</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
