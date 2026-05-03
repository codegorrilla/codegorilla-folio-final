import React from "react";

const WorkPage = ({ children, ...props }) => {
  return <section {...props}>{children}</section>;
};

export default WorkPage;
