import React from "react";

export const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <input
    type="checkbox"
    className="w-4 h-4 accent-blue-500"
    checked={checked}
    onChange={onChange}
  />
);
