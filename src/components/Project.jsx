import React from "react";
import Github from "../images/GitHub-Mark.png";
export default function Project(props) {
  return (
    <div className="group flex flex-row items-center border shadow-xl card p-5 mt-5 card-bordered w-60 hover:bg-slate-100">
      <p className="card-title text-center group-hover:bg-slate-100">
        {props.projectName}
      </p>
      <a href={props.githubLink} target="_blank" rel="noreferrer noopener">
        <img className="w-5" src={Github} alt="github-icon" />
      </a>
    </div>
  );
}
