import React from "react";

export default function Quote(props) {
  return (
    <div className="mb-5">
      <blockquote>
        {props.text}
        <br></br> - {props.author}
      </blockquote>
    </div>
  );
}
