import React from "react";
import { Link } from "react-router-dom";
export default function Nav() {
  return (
    <div>
      <header className="mt-2 text-2xl"> Aryan Naik </header>

      <div className="w-20 ml-5 text-left nav">
        <h1 className="font-medium hover:italic">
          <Link to="/about">About Me</Link>
        </h1>
        <h1 className="font-medium hover:italic">
          <Link to="/writing">Writing</Link>
        </h1>
        <h1 className="font-medium hover:italic"> Projects </h1>
      </div>
    </div>
  );
}
