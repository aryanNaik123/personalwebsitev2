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
        <li>Incoming Security Engineering Intern @ Charles Schwab</li>

        <li>In a previous life...</li>
        <li>
          Intern Associate @{" "}
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.pacecapital.com/"
          >
            Pace Capital
          </a>
        </li>
        <li>
          Summer Associate @{" "}
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.fouracres.vc/"
          >
            Four Acres Capital
          </a>
        </li>
        <li>
          Blockchain Research @{" "}
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.joinmassive.com/"
          >
            Massive
          </a>
        </li>
        <li>Cofounder of VC-backed Crypto startup</li>
        <li>
          Research Affiliate @{" "}
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://gis.harvard.edu/people/aryan-naik"
          >
            Harvard
          </a>
        </li>
        <li>Research Assistant @ Columbia</li>
      </ul>
    </div>
  );
}
