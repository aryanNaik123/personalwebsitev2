import React from "react";
import { Link } from "react-router-dom";
export default function Post(props) {
  // const blog = require("../blog.json");
  // let index = -1;

  // for (let i = 0; i < blog.blogs.length; i++) {
  //   if (blog.blogs[i].title === props.title) {
  //     index = i;
  //     break;
  //   }
  // }

  // const post = blog.blogs[index];

  return (
    <>
      <div>
        <Link to="/" className="ml-5 mt-3 float-left">
          ⏮️
        </Link>
        <div className="pt-10 pl-3 text-left">
          <h1>{props.title}</h1>
          <p>{props.content}</p>
        </div>
      </div>
    </>
  );
}
