import React from "react";
import { Link } from "react-router-dom";
import corgi from "../images/corgi.png";

export default function AboutMe() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>

      <ul className=" ml-5 mt-5 text-center">
        <li>
          Lover of Birkenstocks, Coding, Corgis, Gameboys, Cognitive Science,
          Longevity, Space, Philosophy, and Startups
        </li>
        <li>infovore, philomath, etc</li>
        <div className="flex justify-center items-center">
          <img className="content-center w-32" src={corgi} alt="corgi" />
        </div>
        <li>
          Investor @{" "}
          <a
            href="https://pacecapital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Pace Capital
          </a>
        </li>
        <li>
          <h1>I'm interested in...</h1>
          <p>Aesthetic curation</p>
          <p>Youtube videos, long form, video essays, playlists, raw unedited experiences</p>
          <p>Personal websites + Blogs</p>
          <p>Early/Childhood Education that actively develops polymaths and intellectuals</p>
          <p>Software that replaces processes end to end processes</p>
          <p>Gadgets, gizmos, etc</p>
        </li>
      </ul>
    </div>
  );
}
