import React from "react";
import { Link } from "react-router-dom";
import corgi from "../images/corgi.png";

export default function AboutMe() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>

      <ul className="text-xl ml-5 mt-5 text-center">
        <li>
          Lover of Birkenstocks, Coding, Corgis, Gameboys, Cognitive Science,
          Longevity, Space, Philosophy, and Startups
        </li>
        <li>infovore, philomath, etc</li>
        <div className="flex justify-center items-center">
          <img className="content-center w-32" src={corgi} alt="corgi" />
        </div>
        <li>Investor @ Pace Capital</li>
      </ul>
    </div>
  );
}
