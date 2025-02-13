import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { API_URL } from "../utils";
import HttpsIcon from "@mui/icons-material/Https";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import { UserContext } from "../Contexts/UserContext";

// Define the LoginForm component
export const LoginForm = () => {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Function to handle form submission
  const findUser = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching user:", email);

      const response = await fetch(
        `${API_URL}/user?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      setCurrentUser({
        email: result.user.email,
        password: result.user.password, // Ensure API returns correct casing
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      });

      setError(false);
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      console.log("User found:", currentUser);
      if (password === currentUser.password) {
        navigate("/");
      } else {
        console.log("Invalid email or password");
        setError(true);
      }
    }
  }, [currentUser, password, navigate]);

  // Page Body
  return (
    <div className="backgroundimage">
      <div className="loginBody">
        <div className="rectangle">
          <Typography align="center">
            <div className="logo-container">
              <img src="newlogo.png" alt="ClimbIQ Logo" className="logo" />
              <img src="climbiq-textlogo.png" className="logo-text" />
            </div>
          </Typography>
          <Typography
            align="left"
            variant="h6"
            paddingTop={2}
            paddingBottom={2}
            fontSize="14px"
            color="#002A22"
          >
            <span className="tinytext">Login to your ClimbIQ Account</span>
          </Typography>
          <div className="userForm">
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043", // Change this to your desired focus color
                  },
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22", // Change this to your desired color
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              id="email"
              label="Email"
              variant="outlined"
              error={error}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              name="email"
            />
          </div>
          <div className="userForm">
            <TextField
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 10,
                  "&.Mui-focused fieldset": {
                    borderColor: "#095043", // Change this to your desired focus color
                  },
                 },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                  WebkitTextFillColor: "#002A22", // Change this to your desired color
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpsIcon />
                  </InputAdornment>
                ),
              }}
              type="password"
              id="password"
              label="Password"
              variant="outlined"
              error={error}
              helperText={error ? "Invalid email or password" : ""}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              name="password"
            />
          </div>
          <LoadingButton
            fullWidth
            loading={isLoading}
            size="big"
            disabled={!email.length || !password.length}
            variant="contained"
            onClick={findUser}
            color="error"
            sx={{
              paddingTop: "2",
              borderRadius: 5,
              backgroundColor: "#095043", // Change this to your desired color
              "&:hover": {
                backgroundColor: "#002A22", // Change this to your desired hover color
              },
            }}
          >
            SIGN IN
          </LoadingButton>
          <div className="tinytext">
            <br />
            By logging into your ClimbIQ account, you accept all of the ClimbIQ
            terms and conditions
          </div>
          <div className="tinytext">
            Don't have an account? Create one{" "}
            <Link to="/create-account">here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
