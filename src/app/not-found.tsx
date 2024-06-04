import React from "react";
import CustomLink from "../components/CustomLink";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Oops! The page you&apos;re looking for does not exist.
      </p>
      <CustomLink href="/" legacyBehavior>
        <a className="text-blue-500 hover:underline">Go back to the homepage</a>
      </CustomLink>
    </div>
  );
};

export default NotFound;
