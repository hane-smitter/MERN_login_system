# MERN Login System

This project runs down a **a methodical framework** of how to implement an **advanced** authentication system in a _3-tier application architecture_.

This can serve as a boilerplate to bootstrap authentication logic for your next application.

## Technologies used

This project is built using MERN stack.

![Application 3-tier architecture](https://github.com/hane-smitter/MERN_login_system/blob/assets/three-tier_sm.jpg?raw=true)

### Further breakdown of technologies used

#### Client

- ReactJs
- Redux-toolkit, for centralized state management.
- React-router-dom, for routing _without making http roundtrip_.
- React-bootstrap, for ready made components to use.
- Bootstrap V5, for styling the application.
- Axios, for making API calls.
- Formik for form validations.

#### Server

- ExpressJs
- Mongoose
- Nodemailer
- Express-validator for bullet-proof data validation and sanitization
- Cors for Cross-Origin request configuration
- Bcryptjs for password hashing
- Nodejs Crypto module

#### Database

- MongoDB(Atlas version)

## Drop a ⭐ if you found the project useful

## How is it an advanced authentication system?

- This project uses JWT based authentication tokens.
- Generation of longer-lived refresh token and shorter-lived access token.
- The refresh token is used to obtain a new Access token when it expires.
- Silent authentication. When access token expires, the user-agent automatically reauthenticates without user intervention.
- Server communication follows HTTP standards.
- Cors configuration for cross-origin requests.
- Data Sanitization at Client level and Server level.
- Forgot password/password reset.
- Logout from all Devices.
- Redux Toolkit for State Management.
- Implement success/error notifications once, and it works everywhere without more boilerplate code.

## Getting Started

To run this project, start by forking it and `git clone` the repository into your machine.

This project has two folders that hold logic for separate layers, _i.e the presentation layer(Frontend) located in **client folder**, Application and Database layer(Backend) found in **server folder**_.

### Configuration and SetUp

- Open the source code in your favourite editor.
- Open your terminal to this project location.
- Split your terminal into two or open another tab of your terminal.
- **For the Client**
  - `cd client/standard` to change into directory with the presentation layer.
  - Then `npm install`.
- **For the Server**
  - Go to the other terminal and `cd server`.
  - Then `npm install`.
  - Copy `.env.example` file to `.env`.

Next you need to get configurations for `.env` files.<br />
It should be looking like this:

```
MONGODB_CLOUD=
AUTH_REFRESH_TOKEN_SECRET=
AUTH_REFRESH_TOKEN_EXPIRY=
AUTH_ACCESS_TOKEN_SECRET=
AUTH_ACCESS_TOKEN_EXPIRY=
AUTH_EMAIL_USERNAME=
AUTH_EMAIL_PASSWORD=
EMAIL_FROM=
RESET_PASSWORD_TOKEN_EXPIRY_MINS=
```

| Name                             | Description                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| MONGODB_CLOUD                    | MongoDB Atlas connection string                                |
| AUTH_REFRESH_TOKEN_SECRET        | Secret that will be used to sign **Refresh token**             |
| AUTH_REFRESH_TOKEN_EXPIRY        | Expiry length of the Refresh Token                             |
| AUTH_ACCESS_TOKEN_SECRET         | Secret that will be used to sign **Access token**              |
| AUTH_ACCESS_TOKEN_EXPIRY         | Expiry length of the Access Token                              |
| RESET_PASSWORD_TOKEN_EXPIRY_MINS | Time in Minutes to expiry of password reset link. Default is 5 |
| AUTH_EMAIL_USERNAME              | SMTP email username to be used with NodeMailer                 |
| AUTH_EMAIL_PASSWORD              | SMTP email password to be used with NodeMailer                 |
| EMAIL_FROM                       | The sender that will be set when sending email                 |

## Run the project

You can run the project using configured scripts.

To run the backend, `cd` into the `server` folder then start then type the command in your terminal:

`npm run dev`

Start testing API endpoints quickly by importing `postman_collection_API.json` into your [Postman](https://www.postman.com/company/about-postman/) app.

To run the frontend, `cd` into `client/standard` folder and run the comand in you terminal:

`npm start`

## Author

- Twitter: [@smitterhane](https://twitter.com/intent/user?screen_name=smitterhane)
- Email: [@smitterhane](mailto:hanesmitter3@gmail.com)

## License

- This project is MIT licensed.
