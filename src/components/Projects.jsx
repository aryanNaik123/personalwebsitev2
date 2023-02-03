import React from "react";
import Project from "./Project";
export default function Projects() {
  return (
    <div>
      <h1>My Projects</h1>
      <div className="grid grid-rows-1 grid-flow-col w-96 m-auto gap-4 max-h-screen justify-center">
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
      </div>
    </div>
  );
}
