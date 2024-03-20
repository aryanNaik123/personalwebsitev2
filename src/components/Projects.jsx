import React from "react";
import Project from "./Project";
import { Link } from "react-router-dom";
export default function Projects() {
  return (
    <div>
      <Link to="/" className="ml-5 mt-3 float-left">
        ⏮️
      </Link>

      <h1>My Projects</h1>
      <div className="grid grid-flow-col w-96 m-auto gap-4 max-h-screen justify-center grid-rows-5 lg:grid-rows-2 sm:grid-rows-4 ">
        <Project
          projectName="Todo List App"
          githubLink="https://github.com/aryanNaik123/TodoListApp"
        />
        <Project
          projectName="Pokedex"
          githubLink="https://github.com/aryanNaik123/pokedex"
        />
        <Project
          projectName="Flash Card App"
          githubLink="https://github.com/aryanNaik123/flashcardapp"
        />
        <Project
          projectName="Story Generator"
          githubLink="https://github.com/aryanNaik123/fanfic-generator"
        />
        <Project
          projectName="Weather App"
          githubLink="https://github.com/aryanNaik123/weather-app"
        />
        <Project
          projectName="Chip8 Emulator"
          githubLink="https://github.com/aryanNaik123/chip8"
        />
        <Project
          projectName="TodoistCLI"
          githubLink="https://github.com/aryanNaik123/todoist-cli"
        />
        <Project
          projectName="Lost and Found App"
          githubLink="https://github.com/aryanNaik123/seekr-deploy"
        />
        <Project
          projectName="Librarian"
          githubLink="https://github.com/aryanNaik123/librarian"
        />
        <Project
          projectName="Learning Arduino"
          githubLink="https://github.com/aryanNaik123/librarian"
        />
        <Project
          projectName="Homepage"
          githubLink="https://github.com/aryanNaik123/homepage"
        />
      </div>
    </div>
  );
}
