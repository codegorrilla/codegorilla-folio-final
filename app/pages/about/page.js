// app/pages/AboutPage.jsx
import React from "react";

const AboutPage = ({ children, ...props }) => {
  return <section {...props}>{children}</section>;
};

export default AboutPage;
