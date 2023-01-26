import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { closeNotify } from "../../redux/features/notify/notifySlice";

function AppFeedback({
  openNotify,
  notifyMsg,
  type,
  closeNotification,
  title,
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log("OPEN FEEDBACK STATE: ", openNotify);
    setOpen(openNotify);
  }, [openNotify]);

  // When route changes, close the notification
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [location]);

  return (
    <div className="position-relative w-100">
      <Alert
        variant={type}
        show={open}
        onClose={closeNotification}
        dismissible
        className="position-absolute w-100"
      >
        {title && <Alert.Heading>{title}</Alert.Heading>}
        {notifyMsg}
      </Alert>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openNotify: state.notice.open,
    notifyMsg: state.notice.msg,
    type: state.notice.variant,
  };
};
const mapDispatchToProps = (dispatch) => ({
  closeNotification: () => dispatch(closeNotify()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppFeedback);
