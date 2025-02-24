import React, { useState, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../utils";
import { UserContext } from "../Contexts/UserContext";

export const AddUserForm = () => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [newUser, setNewUser] = useState("");
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmUser, setConfirmUser] = useState("");
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [passwordHelper, setPasswordHelper] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const AddNewUser = async () => {
    if (newUser !== confirmUser) {
      setPasswordHelper("Passwords do not match");
      return;
    } else if (!passwordRegex.test(newUser)) {
      setPasswordHelper(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
    if (!emailRegex.test(newEmail)) {
      setEmailError("Invalid email");
      return;
    }

    try {
      isLoading(true);
      const getResponse = await fetch(`${API_URL}/user?email=${newEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "none",
        },
        mode: "cors",
      });
      const getResult = await getResponse.json();

      if (getResult?.user?.email) {
        setEmailError("Email already in use");
        return;
      }

      const postResponse = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "none",
        },
        body: JSON.stringify({
          email: newEmail,
          firstName: newFirst,
          lastName: newLast,
          password: newUser,
          cart: [],
        }),
        mode: "cors",
      });

      const result = await postResponse.json();
      setCurrentUser({
        email: newEmail,
        password: newUser,
        firstName: newFirst,
        lastName: newLast,
        cart: [],
      });

      console.log(result);
      console.log(JSON.stringify(currentUser));
    } catch (error) {
      console.error(error);
    } finally {
      isLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.firstName) {
      navigate("/", { state: currentUser });
    }
  }, [currentUser, navigate]);

  return (
    <div className="backgroundimageCreateAccount">
      <div className="loginBody">
        <div className="addUserRectangle">
          <div className="logo-container">
            <img src="newlogo.png" alt="ClimbIQ Logo" className="logo" />
            <img src="climbiq-textlogo.png" className="logo-text" />
          </div>
          <Typography
            align="left"
            variant="h6"
            paddingTop={2}
            paddingBottom={2}
            fontSize="1.2vw"
          >
            <span className="tinytext">Create your ClimbIQ account</span>
          </Typography>
          <div className="addUserForm">
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043",
                  },
                  "& .MuiFormLabel-root": {
                    color: "red", // Change the label color to blue
                  },
                  "& .MuiInputBase-input": {
                    color: "#000", // Change the text color to red
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22",
                },
              }}
              id="firstName"
              label="First Name"
              variant="outlined"
              value={newFirst}
              onChange={(e) => setNewFirst(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043",
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22",
                },
              }}
              id="lastName"
              label="Last Name"
              variant="outlined"
              value={newLast}
              onChange={(e) => setNewLast(e.target.value)}
            />
          </div>
          <div className="addUserForm">
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043",
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22",
                },
              }}
              id="email"
              error={!!emailError}
              helperText={emailError}
              label="Email"
              variant="outlined"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="addUserForm">
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043",
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22",
                },
              }}
              id="password"
              helperText={passwordHelper}
              error={passwordHelper}
              label="Set Password"
              variant="outlined"
              type="password"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043",
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22",
                },
              }}
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              type="password"
              error={passwordHelper}
              value={confirmUser}
              onChange={(e) => {
                setConfirmUser(e.target.value);
                setPasswordHelper(false);
              }}
            />
          </div>
          <div className="addUserForm">
            <LoadingButton
              loading={loading}
              fullWidth
              size="big"
              disabled={
                !newUser.length ||
                !newFirst.length ||
                !newLast.length ||
                !newEmail.length
              }
              variant="contained"
              onClick={AddNewUser}
              paddingTop={2}
              sx={{
                borderRadius: 5,
                paddingTop: "2",
                borderRadius: 5,
                backgroundColor: "#095043",
                "&:hover": {
                  backgroundColor: "#002A22",
                },
              }}
            >
              Create Account
            </LoadingButton>
          </div>
          <div className="tinytext">
            By creating an account, you accept all of the ClimbIQ terms and
            conditions
          </div>
          <div className="tinytext">
            Already have an account? Login <Link to="/login">here!</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
