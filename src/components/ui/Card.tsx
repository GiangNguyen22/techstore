import React from "react";

// components/ui/Card.tsx

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded shadow-sm bg-white ${className}`}>
    {children}
  </div>
);
