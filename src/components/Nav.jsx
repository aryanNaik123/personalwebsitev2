import React from "react";
import { Link } from "react-router-dom";
import Clock from "./Clock";

export default function Nav() {
  return (
    <div>
      <header className="mt-2 text-2xl">Aryan Naik</header>
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
        <h1 className="font-medium hover:italic">
          <Link to="/library">Library↗</Link>
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
          <br></br>
          <span>Status: down another 🕳️🐇</span>
          <br></br>
          <span className="">Say hi: aryannnaik01[at]gmail[dot]com</span>
        </span>
      </div>
      <div className="mt-2 text-left font-medium ml-5">
        <span className="underline">
          <span className="line-through">Tools</span> Toys I{" "}
          <span className="line-through">use</span> play with
        </span>
        <ul className="w-20">
          <li className="hover:italic">
            <a
              href="https://arc.net/"
              target="_blank"
              rel="noreferrer noopener"
            >
              arc
            </a>
          </li>
          <li className="hover:italic">
            <a
              href="https://cron.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              cron
            </a>
          </li>
        </ul>
      </div>
      <div className="bottom-0">
        <p>Aryan © 2024</p>
        <Clock />
      </div>
    </div>
  );
}
