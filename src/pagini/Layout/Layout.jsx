import React from "react";
import styles from "./Layout.module.scss";

const Layout = ({ children }) => {
  return <main className={styles.layout}><div className={styles.container}>{children}</div></main>;
};

export default Layout;
