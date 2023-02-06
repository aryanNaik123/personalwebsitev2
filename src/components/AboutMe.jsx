import React from "react";
import { Link } from "react-router-dom";
export default function AboutMe() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>

      <ul className="text-xl ml-5 mt-5 text-center">
        <li>Currently Intern @ Pace Capital</li>
        <li>In a previous life...</li>
        <li>
          Summer Associate @
          <a className="underline" href="https://www.fouracres.vc/">
            Four Acres Capital
          </a>
        </li>
        <li>
          Blockchain Research @
          <a className="underline" href="https://www.joinmassive.com/">
            Massive
          </a>
        </li>
        <li>Cofounder of VC-backed Crypto startup</li>
        <li>Research Affiliate @ Harvard</li>
        <li>Research Assistant @ Columbia</li>
      </ul>
    </div>
  );
}
