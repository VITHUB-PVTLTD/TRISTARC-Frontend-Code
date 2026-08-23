import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Tag = 'div',
}) => (
  <Tag className={`container-main ${className}`}>{children}</Tag>
);
