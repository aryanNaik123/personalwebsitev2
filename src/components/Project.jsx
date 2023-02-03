import React from "react";
import Github from "../images/GitHub-Mark.png";
export default function Project(props) {
  return (
    <div className="flex flex-row items-center border shadow-xl card p-5 mt-5 card-bordered w-max hover:bg-gray-50 ">
      <p className="card-title text-center">{props.projectName}</p>
      <a href={props.githubLink} target="_blank" rel="noreferrer noopener">
        <img className="w-5" src={Github} alt="github-icon" />
      </a>
    </div>
  );
}
