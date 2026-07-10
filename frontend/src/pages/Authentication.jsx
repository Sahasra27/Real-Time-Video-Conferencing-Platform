import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";

import { AuthContext } from "../contexts/AuthContext";

import bgImage from "../assets/vc.2.png";

export default function Authentication() {
 const [username, setUsername] = React.useState("");
const [password, setPassword] = React.useState("");
const [name, setName] = React.useState("");

const [error, setError] = React.useState("");
const [messages, setMessages] = React.useState("");

const [formState, setFormState] = React.useState(0);

const [open, setOpen] = React.useState(false);
  const {handleRegister, handleLogin}= React.useContext(AuthContext);
 let handleAuth = async () => {

  try {

 

  if (formState === 1) {

    let result = await handleRegister(
      name,
      username,
      password
    );
    setMessages(result);

    setUsername("");
    setPassword("");
setFormState(0);


    setOpen(true);
  } else {
    
    let result = await handleLogin(
      username,
      password
    );
    setMessages(result);

    setUsername("");
    setPassword("");
  }

} catch (err) {

  setMessages("");

  let message =
    err?.response?.data?.message ||
    "Something went wrong";

  setError(message);

  setOpen(true);
}
 }
  return (
    <>
      <CssBaseline />

  <Stack
  component="main"
  sx={{
    width: "100vw",
    height: "100vh",

    position: "fixed",
    inset: 0,

    display: "flex",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    "&::before": {
      content: '""',

      position: "absolute",

      inset: 0,

      background:
        "linear-gradient(rgba(5,5,20,0.72), rgba(5,5,20,0.82))",

      zIndex: 0,
    },
  }}
>
  <Card
  sx={{
    width: 450,

    position: "relative",

    zIndex: 2,

    display: "flex",
    flexDirection: "column",

    justifyContent: "center",

    padding: "54px 46px",

    borderRadius: "36px",

    overflow: "hidden",

    background: `
      linear-gradient(
        155deg,
        rgba(9,10,28,0.96) 0%,
        rgba(16,18,45,0.93) 35%,
        rgba(20,10,55,0.92) 100%
      )
    `,

    backdropFilter: "blur(28px)",

    border: "1px solid rgba(255,255,255,0.08)",

    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.03),
      0 10px 45px rgba(0,0,0,0.55),
      0 0 90px rgba(91,33,182,0.28),
      0 0 140px rgba(59,130,246,0.12)
    `,

    transition: "all 0.45s ease",

    "&:hover": {
      transform: "translateY(-6px) scale(1.01)",

      boxShadow: `
        0 0 0 1px rgba(255,255,255,0.05),
        0 14px 60px rgba(0,0,0,0.65),
        0 0 110px rgba(147,51,234,0.35),
        0 0 170px rgba(59,130,246,0.16)
      `,
    },

    /* ===== TOP PURPLE GLOW ===== */

    "&::before": {
      content: '""',

      position: "absolute",

      top: "-180px",
      right: "-180px",

      width: "420px",
      height: "420px",

      background: `
        radial-gradient(
          circle,
          rgba(168,85,247,0.30) 0%,
          rgba(168,85,247,0.12) 35%,
          transparent 72%
        )
      `,

      zIndex: 0,
    },

    /* ===== BOTTOM BLUE GLOW ===== */

    "&::after": {
      content: '""',

      position: "absolute",

      bottom: "-220px",
      left: "-180px",

      width: "430px",
      height: "430px",

      background: `
        radial-gradient(
          circle,
          rgba(59,130,246,0.22) 0%,
          rgba(59,130,246,0.08) 38%,
          transparent 74%
        )
      `,

      zIndex: 0,
    },
  }}
>  {/* ===== TITLE ===== */}


          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              mb: 4,
            }}
          >
           <Typography
  variant="h3"
  sx={{
    fontWeight: 700,

    letterSpacing: 1.5,

    textShadow:
      "0 0 20px rgba(162,89,255,0.5)",
  }}
>
  <>
    <span style={{ color: "white" }}>Meet</span>

    <span
      style={{
        background: "linear-gradient(90deg, #7B61FF, #4F8CFF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Pro
    </span>
  </>
</Typography>
            <Typography
              sx={{
                mt: 1,

                color: "rgba(255,255,255,0.65)",

                fontSize: "0.95rem",

                letterSpacing: 0.5,
              }}
            >
              Connect • Collaborate • Communicate
            </Typography>
          </Box>
          <Box
  sx={{
    mb: 2,
    fontSize: "0.95rem",
    letterSpacing: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
  }}
>
  <Button
    variant={formState === 0 ? "contained" : "text"}
    onClick={() => setFormState(0)}
    sx={{
      color: "#c084fc",
      background:
        formState === 0
          ? "linear-gradient(90deg, #7f00ff, #e100ff)"
          : "transparent",

      "&:hover": {
        background:
          formState === 0
            ? "linear-gradient(90deg, #7f00ff, #e100ff)"
            : "rgba(255,255,255,0.08)",
      },
    }}
  >
    Sign In
  </Button>

  <Button
    variant={formState === 1 ? "contained" : "text"}
    onClick={() => setFormState(1)}
    sx={{
      color: "#c084fc",
      background:
        formState === 1
          ? "linear-gradient(90deg, #7f00ff, #e100ff)"
          : "transparent",

      "&:hover": {
        background:
          formState === 1
            ? "linear-gradient(90deg, #7f00ff, #e100ff)"
            : "rgba(255,255,255,0.08)",
      },
    }}
  >
    Sign Up
  </Button>
</Box>

{formState==1? <TextField
            fullWidth
            label="Full Name"
            id="username"
            variant="outlined"
            margin="normal"
            onChange={(e)=>setName(e.target.value)}
            InputLabelProps={{
              shrink: false,
            }}
            sx={{
              position: "relative",
              zIndex: 1,
"& input:-webkit-autofill": {
  WebkitBoxShadow:
    "0 0 0 1000px rgb(28, 28, 54) inset",

  WebkitTextFillColor: "white",

  caretColor: "white",

  borderRadius: "18px",

  transition:
    "background-color 9999s ease-in-out 0s",
},
              "& .MuiInputLabel-root": {
                color: "#c084fc",
                fontSize: "0.95rem",
                fontWeight: 500,
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#e879f9",
              },

              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",

                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

                backdropFilter: "blur(12px)",

                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.08)",
                  borderWidth: "1.5px",
                },

                "&:hover fieldset": {
                  borderColor: "#a855f7",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#c026d3",

                  boxShadow:
                    "0 0 18px rgba(168,85,247,0.35)",
                },
              },

              "& input": {
                color: "white",

                padding: "18px",

                fontSize: "1rem",

                fontWeight: 500,
              },
            }}
          />
:<></>}

          {/* ===== EMAIL ===== */}

          <TextField
            fullWidth
            label="Username"
            id="username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}

            InputLabelProps={{
              shrink: false,
            }}
            inputProps={{
  autoComplete: "off",
}}
            sx={{
              position: "relative",
              zIndex: 1,
              "& input:-webkit-autofill": {
  WebkitBoxShadow:
    "0 0 0 1000px rgb(28, 28, 54) inset",

  WebkitTextFillColor: "white",

  caretColor: "white",

  borderRadius: "18px",

  transition:
    "background-color 9999s ease-in-out 0s",
},
              "& .MuiInputLabel-root": {
                color: "#c084fc",
                fontSize: "0.95rem",
                fontWeight: 500,
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#e879f9",
              },

              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",

                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

                backdropFilter: "blur(12px)",

                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.08)",
                  borderWidth: "1.5px",
                },

                "&:hover fieldset": {
                  borderColor: "#a855f7",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#c026d3",

                  boxShadow:
                    "0 0 18px rgba(168,85,247,0.35)",
                },
              },

              "& input": {
                color: "white",

                padding: "18px",

                fontSize: "1rem",

                fontWeight: 500,
              },
            }}
          />

          {/* ===== PASSWORD ===== */}

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}

           
             InputLabelProps={{
    shrink: false,
  }}

  inputProps={{
    autoComplete: "off",
  }}
            sx={{
              mt: 3,

              position: "relative",
              zIndex: 1,
              "& input:-webkit-autofill": {
  WebkitBoxShadow:
    "0 0 0 1000px rgb(28, 28, 54) inset",

  WebkitTextFillColor: "white",

  caretColor: "white",

  borderRadius: "18px",

  transition:
    "background-color 9999s ease-in-out 0s",
},
              

              "& .MuiInputLabel-root": {
                color: "#c084fc",
                fontSize: "0.95rem",
                fontWeight: 500,
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#e879f9",
              },

              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",

                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

                backdropFilter: "blur(12px)",

                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.08)",
                  borderWidth: "1.5px",
                },

                "&:hover fieldset": {
                  borderColor: "#a855f7",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#c026d3",

                  boxShadow:
                    "0 0 18px rgba(168,85,247,0.35)",
                },
              },

              "& input": {
                color: "white",

                padding: "18px",

                fontSize: "1rem",

                fontWeight: 500,
              },
            }}
          />

          {/* ===== REMEMBER ===== */}

          <FormControlLabel
            sx={{
              mt: 1,
              color: "rgba(255,255,255,0.7)",
              position: "relative",
              zIndex: 1,
            }}
            control={
              <Checkbox
                sx={{
                  color: "#a855f7",

                  "&.Mui-checked": {
                    color: "#c026d3",
                  },
                }}
              />
            }
            label="Remember me"
          />
          {/* ===== LOGIN BUTTON ===== */}

          <Button
            fullWidth
            variant="contained"
            onClick={handleAuth}
            sx={{
              mt: 4,

              py: 1.6,

              borderRadius: "18px",

              fontWeight: 700,

              fontSize: "1rem",

              letterSpacing: 1.2,

              position: "relative",

              zIndex: 1,

              background:
                "linear-gradient(90deg, #7f00ff, #e100ff)",

              boxShadow:
                "0 0 25px rgba(161,0,255,0.5)",

              transition: "0.3s ease",

              "&:hover": {
                transform: "translateY(-2px)",

                background:
                  "linear-gradient(90deg, #9333ea, #c026d3)",

                boxShadow:
                  "0 0 35px rgba(161,0,255,0.7)",
              },
            }}
          >
            {formState === 0?"Login": "Register"}
          </Button>
        </Card>
      </Stack>
     <Snackbar
  open={open}
  autoHideDuration={4000}
  onClose={() => setOpen(false)}
  message={error ? error : messages}
/>
    </>
  );
}