import React from "react";

export default function Project(props) {
  return (
    <div className="">
      <div className="border-solid rounded border-2">
        <p>{props.projectName}</p>
      </div>
    </div>
  );
}
