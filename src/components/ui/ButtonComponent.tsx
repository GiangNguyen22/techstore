type Props = {
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: () => void; // 👈 Thêm dòng này
};

const ButtonComponent = ({
  children,
  type = "button",
  className,
  style,
  disabled,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;
