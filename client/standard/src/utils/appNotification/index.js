import React, { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import { closeNotify } from "../../redux/features/notify/notifySlice";

function AppNotification({ isOpen, msg, type, close, title }) {
  const location = useLocation();

  // When route changes, close the notification
  useEffect(() => {
    const authFailure = location.state?.reason === "NOAUTH";
    if (isOpen && !authFailure) close();
  }, [location]);

  return (
    <div className="position-relative w-100">
      <Alert
        variant={type}
        show={isOpen}
        onClose={close}
        dismissible
        className="position-absolute w-100"
      >
        {title && <Alert.Heading>{title}</Alert.Heading>}
        {msg}
      </Alert>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.notice.open,
    msg: state.notice.msg,
    type: state.notice.variant,
  };
};
const mapDispatchToProps = (dispatch) => ({
  close: () => dispatch(closeNotify()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppNotification);
