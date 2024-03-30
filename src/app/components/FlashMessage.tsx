"use client";

import { useEffect, useState } from "react";

export default function FlashMessage({
  action,
  message,
}: {
  action: "success" | "danger";
  message: string;
}) {
  const [visible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(!visible);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  let divClassName = "absolute top-4 rounded-md min-w-fit py-2 px-4";
  if (action === "danger") {
    divClassName += " bg-[#d93030]";
  } else {
    divClassName += " bg-[#51d840]";
  }

  return (
    <>
      {visible && (
        <div
          className={`${divClassName} ${
            visible
              ? "animate-[fadeIn_.5s_ease-in-out]"
              : "animate-[fadeOut_.5s_ease-in-out]"
          }`}
        >
          <span className="text-xl font-medium text-[#fff] ">{message}</span>
        </div>
      )}
    </>
  );
}
