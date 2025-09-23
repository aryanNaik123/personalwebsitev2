import React, { useEffect } from "react";
import { marked } from "marked";

export default function Post(props) {
  const html = marked(props.content);
  useEffect(() => {
    document.title = `${props.title}`;
  }, [props.title]);

  const contentStyle = {
    whiteSpace: "pre-line", // Preserve newline characters
    wordWrap: "break-word",
    overflowWrap: "break-word",
    hyphens: "auto",
  };

  return (
    <>
      <style>
        {`
          .post-content a {
            word-break: break-all;
            overflow-wrap: break-word;
            hyphens: auto;
          }
          .post-content {
            word-break: break-word;
            overflow-wrap: break-word;
          }
        `}
      </style>
      <div>
        <div className="pt-10 px-4 sm:px-6 md:px-8 lg:px-12 text-left max-w-full">
          <h1 className="text-center">{props.title}</h1>
          <div
            className="post-content break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: html }}
            style={contentStyle}
          ></div>
        </div>
      </div>
    </>
  );
}
