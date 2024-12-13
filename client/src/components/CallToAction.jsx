import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn about React.JS?</h2>
        <p className="text-gray-500 mt-1 mb-5">
          Checkout this resources with 100 React.JS projects
        </p>
        <a
          href="https://github.com/zippostorm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            gradientDuoTone="purpleToPink"
            className="rounded-tl-xl rounded-bl-none w-full"
          >
            Learn More
          </Button>
        </a>
      </div>
      <div className="p-7 flex-1">
        <img src="https://cloud.appwrite.io/v1/storage/buckets/6751f8f50016d01eb3ad/files/6758246d001cf0ba7bd7/view?project=6751f02300346c4aaccb&project=6751f02300346c4aaccb&mode=admin" />
      </div>
    </div>
  );
};

export default CallToAction;
