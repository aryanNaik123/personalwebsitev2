import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";

export default function Post(props) {
  const html = marked(props.content);
  useEffect(() => {
    document.title = `${props.title}`;
  }, [props.title]);

  const contentStyle = {
    whiteSpace: "pre-line", // Preserve newline characters
  };

  return (
    <>
      <div>
        <Link to="/writing" className="ml-5 mt-3 float-left">
          ⏮️
        </Link>
        <div className="pt-10 pl-3 text-left">
          <h1 className="text-center">{props.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={contentStyle}
          ></div>
        </div>
      </div>
    </>
  );
}
