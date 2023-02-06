import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/actions";

function Login() {
  const dispatch = useDispatch();
  const loginLoading = useSelector(({ auth }) => auth.user_loading);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email address is invalid")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, actions) => {
      // alert(JSON.stringify(values, null, 2));
      function alterFormToAPIResult(error, success) {
        if (error) {
          actions.setFieldTouched("password", false);
          actions.setFieldValue("password", "");
        }
      }
      dispatch(login(values, alterFormToAPIResult));
    },
  });

  return (
    <div style={{ maxWidth: 500, marginInline: "auto" }}>
      <h2 className="text-uppercase mb-3">Login to your account.</h2>

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Email"
            tabIndex={1}
          />

          {formik.touched.email && formik.errors.email ? (
            <Form.Text className="text-danger">{formik.errors.email}</Form.Text>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="position-relative">
            <Form.Text
              className="text-primary m-0 text-decoration-none"
              style={{
                position: "absolute",
                right: 0,
                transform: "translateY(-100%)",
              }}
              as={Link}
              to="/recoverpass"
              tabIndex={5}
            >
              Forgot password?
            </Form.Text>
            <Form.Control
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Password"
              tabIndex={2}
            />
          </div>

          {formik.touched.password && formik.errors.password ? (
            <Form.Text className="text-danger">
              {formik.errors.password}
            </Form.Text>
          ) : null}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="text-uppercase"
          disabled={loginLoading}
          tabIndex={3}
        >
          {loginLoading ? "Loading..." : "Submit"}
        </Button>

        <p className="text-muted fst-italic mt-1">
          Don't have an account yet?{" "}
          <Link to="/signup" tabIndex={4}>
            Sign Up here
          </Link>
        </p>
      </Form>
    </div>
  );
}

export default Login;
