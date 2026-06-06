import { Input, InputProps, Tooltip } from "@heroui/react";
import { useState } from "react";
import { BiHide, BiRefresh, BiShow } from "react-icons/bi";

interface Props extends InputProps {
  generatePassword?: boolean;
}

const PasswordInput = ({ generatePassword, ...props }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleGeneratePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (props.onValueChange) {
      props.onValueChange(result);
    } else if (props.onChange) {
      const event = {
        target: { value: result, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      endContent={
        <div className="flex items-center gap-2">
          {generatePassword && (
            <Tooltip size="sm" content="Generate Password">
              <button
                className="focus:outline-none hover:opacity-70 transition"
                aria-label="generate password"
                type="button"
                onClick={handleGeneratePassword}
              >
                <BiRefresh size={20} className="text-gray-400" />
              </button>
            </Tooltip>
          )}

          {props.value && (
            <button
              className="focus:outline-none"
              aria-label="toggle password visibility"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <BiHide size={17} className="text-gray-400" />
              ) : (
                <BiShow size={17} className="text-gray-400" />
              )}
            </button>
          )}
        </div>
      }
    />
  );
};

export default PasswordInput;
