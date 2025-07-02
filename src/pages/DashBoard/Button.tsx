import { HTMLProps } from "react";

interface ButtonType {
  className?: HTMLProps<HTMLElement>["className"];
  children?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: any;
}

const Button = ({
  className,
  children,
  onClick,
  onKeyDown,
  tabIndex,
}: ButtonType) => {
  return (
    <button
      onKeyDown={onKeyDown}
      onClick={onClick}
      tabIndex={tabIndex}
      className={` ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
