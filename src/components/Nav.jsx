import React from "react";
import { Link } from "react-router-dom";
import Clock from "./Clock";
import SocialIcons from "./SocialIcons";
import "./Nav.css";

export default function Nav() {
  return (
    <div>
      <header className="mt-2 text-2xl">Aryan Naik</header>
      <div className="w-20 ml-5 text-left nav">
        <h1 className="font-medium">
          <Link to="/about" className="nav-link">About↗</Link>
        </h1>
        <h1 className="font-medium">
          <Link to="/writing" className="nav-link">Writing↗</Link>
        </h1>
        <h1 className="font-medium">
          <Link to="/library" className="nav-link">Library↗</Link>
        </h1>
        <h1 className="font-medium">
          <Link to="/links" className="nav-link">Links↗</Link>
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
          <p className="mt-4">
            <a 
              href="mailto:aryan@pacecapital.com?subject=hey!&body=I%20found%20your%20website."
              className="hover:italic"
            >
              Say hi
            </a>
            {" or "}
            <a 
              href="https://www.admonymous.co/aryan-naik"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:italic"
            >
              give anonymous feedback
            </a>
          </p>
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
          <li className="hover:italic">
            <a
              href="https://cline.bot/"
              target="_blank"
              rel="noreferrer noopener"
            >cline</a>
          </li>
        </ul>
      </div>
      <div className="mt-6 ml-5 text-left">
        <SocialIcons />
      </div>
      <div className="bottom-0">
        <p>Aryan © 2025</p>
        <Clock />
      </div>
    </div>
  );
}
