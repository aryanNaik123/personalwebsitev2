import React from "react";
import { Link } from "react-router-dom";
export default function AboutMe() {
  return (
    <div>
      <Link to="/" className="justify-self-start">
        ⏮️
      </Link>
      <ul className="text-2xl">
        <li>Did some things at harvard</li>
        <li>did some more stuff at columbia</li>
      </ul>
    </div>
  );
}
