import { Spinner } from "@heroui/react";

const LoadingProgress = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingProgress;
