import React from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

export default function Post(props) {
  const html = marked(props.content);
  useEffect(() => {
    document.title = `${props.title}`;
  }, [props.title]);

  return (
    <>
      <div>
        <Link to="/writing" className="ml-5 mt-3 float-left">
          ⏮️
        </Link>
        <div className="pt-10 pl-3 text-left">
          <h1 className="text-center">{props.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      </div>
    </>
  );
}
