import React from "react";
import { Link } from "react-router-dom";
import Clock from "./Clock";
export default function Nav() {
  return (
    <div>
      <header className="mt-2 text-2xl"> Aryan Naik </header>
      <div className="w-20 ml-5 text-left nav">
        <h1 className="font-medium hover:italic">
          <Link to="/about">About↗</Link>
        </h1>
        <h1 className="font-medium hover:italic">
          <Link to="/writing">Writing↗</Link>
        </h1>
        <h1 className="font-medium hover:italic">
          <Link to="/projects">Projects↗</Link>
        </h1>
      </div>
      <div className="mt-2 text-left font-medium ml-5">
        <span>
          See what I am reading on&nbsp;
          <span className="underline hover:italic">
            <a
              href="https://curius.app/aryan-naik"
              target="_blank"
              rel="noreferrer noopener"
            >
              curius
            </a>
          </span>
        </span>
      </div>
      <div className="mt-2 text-left font-medium ml-5">
        <span className="underline">
          <span className="line-through">Tools</span> Toys I{" "}
          <span className="line-through">use</span> play with
        </span>
        <ul>
          <li>
            <a href="https://arc.net/">arc</a>
          </li>
          <li>
            <a href="https://cron.com/">cron</a>
          </li>
          <li href="https://farcaster.xyz/">farcaster</li>
        </ul>
      </div>
      <div className="bottom-0">
        <p>Aryan © 2023</p>
        <Clock />
      </div>
    </div>
  );
}
