import React from "react";
import CallToAction from "../components/CallToAction";

const Projects = () => {
  return (
    <div className="min-h-full max-w-2xl m-auto flex flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold text-center">Projects</h1>
      <p className="text-md text-center text-gray-500">
        Check fun and useful projects using React JS / Next JS / with MERN
        technologies and Tailwind CSS here
      </p>
      <CallToAction />
    </div>
  );
};

export default Projects;
