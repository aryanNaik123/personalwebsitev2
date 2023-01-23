import React from "react";
import { Link } from "react-router-dom";
export default function AboutMe() {
  return (
    <div>
      <Link to="/" className="justify-self-start">
        ⏮️
      </Link>
      <ul className="text-xl text-left ml-5">
        <li>Prev.</li>
        <li>
          Summer Associate @{" "}
          <a className="underline" href="https://www.fouracres.vc/">
            {" "}
            Four Acres Capital
          </a>
        </li>
        <li>
          Blockchain Research @{" "}
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
