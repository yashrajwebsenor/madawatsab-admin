import { Button } from "@heroui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Props = {
  path?: string;
};

/**
 * A stylized back button with smooth interactions and premium styling.
 */
const BackButton = ({ path }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      isIconOnly
      radius="full"
      variant="light"
      onPress={() => {
        if (path) {
          navigate(path);
        } else {
          navigate(-1);
        }
      }}
      className="group bg-default-100 hover:bg-default-200 dark:bg-default-50 dark:hover:bg-default-100 shadow-sm transition-all duration-200 active:scale-90"
    >
      <FiArrowLeft 
        size={22} 
        className="text-default-600 transition-transform duration-200 group-hover:-translate-x-0.5" 
      />
    </Button>
  );
};

export default BackButton;

