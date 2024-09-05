import React from "react";
import styles from "./ErrorNotification.module.css";

const ErrorNotification = ({ content, type = 'error' }) => {
  const getTypeClass = () => {
    switch (type) {
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.error;
    }
  };

  return <div className={`${styles.alertBox} ${getTypeClass()}`}>{content}</div>;
};

export default ErrorNotification;
