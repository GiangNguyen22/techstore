interface Props {
  name: string;
  type: string;
  placeholder?: string;
  value: string;
    className?: string; 

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
}

const InputComponent = ({
  placeholder,
  type,
  handleChange,
  value,
  name,
    onBlur,  
className
}: Props) => {
  return (
    <input
      onChange={handleChange} // Gọi hàm handleChange khi có sự thay đổi
      name={name} // Cho phép name để Formik sử dụng
      type={type}
      placeholder={placeholder}
      value={value} // Gắn giá trị từ props
      onBlur={onBlur} // dùng onBlur ở đây
      className="block w-full border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:border-[rgba(0, 0, 0, .54)] sm:text-sm sm:leading-6"
    />
  );
};

export default InputComponent;
