import { Loader } from "@mantine/core";

const LoaderPlaceholder = () => (
  <div className="h-full flex justify-center items-center">
    <Loader type="dots" />
  </div>
);

export default LoaderPlaceholder;
