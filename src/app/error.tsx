"use client"; // Error components must be Client Components

import { Button } from "@mantine/core";
import { PiSmileySadLight } from "react-icons/pi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 h-screen overflow-y-auto">
      <PiSmileySadLight size={100} />
      <h1 className="text-2xl font-bold">Client Side Error Occurred</h1>
      <div className="my-2 max-w-[50vw]">
        <h2 className="font-bold">
          Error name:{" "}
          <code className="italic font-thin text-green-500">{error?.name}</code>
        </h2>
        <h2 className="font-bold">
          Error message:{" "}
          <code className="italic font-thin text-red-500">
            {error?.message}
          </code>
        </h2>
        <h2 className="font-bold max-h-28 overflow-y-auto">
          Error Stack:{" "}
          <code className="text-slate-500 text-xs">
            {error?.stack}
          </code>
        </h2>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
