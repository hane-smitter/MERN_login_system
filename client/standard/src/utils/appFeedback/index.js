import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import { closeFeedback } from "../../redux/reducers/feedbackSlice";

function AppFeedback({ openAlert, feedbackMsg, type, closeAlert, title }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("OPEN FEEDBACK STATE: ", openAlert);
    setOpen(openAlert);
  }, [openAlert]);

  return (
    <div className="position-relative w-100">
      <Alert
        variant={type}
        show={open}
        onClose={closeAlert}
        dismissible
        className="position-absolute w-100"
      >
        {title && <Alert.Heading>{title}</Alert.Heading>}
        {feedbackMsg}
      </Alert>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openAlert: state.feedback.open,
    feedbackMsg: state.feedback.msg,
    type: state.feedback.type,
  };
};
const mapDispatchToProps = (state) => (dispatch) => ({
  closeAlert: () => dispatch(closeFeedback()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppFeedback);
