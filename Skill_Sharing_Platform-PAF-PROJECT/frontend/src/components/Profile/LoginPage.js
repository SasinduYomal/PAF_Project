import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  Slide,
  Link,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CameraAltOutlined,
  Visibility,
  VisibilityOff,
  Fingerprint,
  Google,
  GitHub,
} from "@mui/icons-material";
import FacebookIcon from '@mui/icons-material/Facebook';
import { keyframes, styled } from "@mui/system";

// Gradient background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Floating animation for the camera icon
const floatAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

// Pulse animation for the submit button
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 144, 255, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(30, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 144, 255, 0); }
`;

// Custom styled button with gradient
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1E90FF 0%, #00BFFF 100%)",
  color: "white",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "50px",
  boxShadow: "0 4px 15px rgba(30, 144, 255, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(30, 144, 255, 0.6)",
    background: "linear-gradient(45deg, #1E90FF 30%, #00BFFF 90%)",
  },
}));

function Login() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword]   = useState(false);
    const [error, setError]                 = useState("");
    const [checking, setChecking] = useState(true);

    const navigate  = useNavigate();
    const location  = useLocation();

    useEffect(() => {
        const params  = new URLSearchParams(location.search);
        const rawUser = params.get("user");
        if (!rawUser) return;

        try {
            const userObj = JSON.parse(decodeURIComponent(rawUser));
            localStorage.setItem("user", JSON.stringify(userObj));
            navigate("/UserProfile", { replace: true });
        } catch (err) {
            console.error("Failed to parse user from OAuth redirect:", err);
        }
    }, [location.search, navigate]);

    useEffect(() => {
        const params  = new URLSearchParams(location.search);
        if (params.get("user")) {
            setChecking(false);      // case 1 will handle it
            return;
        }

        const verifySession = async () => {
            try {
                const res = await axios.get("http://localhost:8080/users/me", {
                    withCredentials: true,
                });
                localStorage.setItem("user", JSON.stringify(res.data));
                navigate("/UserProfile", { replace: true });
            } catch {
                /* not logged in – show the form */
            } finally {
                setChecking(false);
            }
        };
        verifySession();
    }, [location.search, navigate]);

    const handleChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8080/users/login",
                credentials,
                { withCredentials: true }
            );
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/UserProfile");
        } catch {
            setError("Invalid username or password");
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href =
            `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    if (checking) return null;

    return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg, #0a192f, #172a45, #1e3a8a, #1e90ff)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 12s ease infinite`,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          zIndex: 0,
        },
      }}
    >
      {/* Animated floating bubbles */}
      {Array.from({ length: 10 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            animation: `${floatAnimation} ${
              15 + Math.random() * 15
            }s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 30}px`,
            height: `${10 + Math.random() * 30}px`,
            zIndex: 0,
          }}
        />
      ))}

      <Slide in={true} direction="up" timeout={500}>
        <Container component="main" maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "16px",
              backgroundColor: "rgba(10, 25, 47, 0.85)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background:
                  "linear-gradient(45deg, transparent, rgba(30, 144, 255, 0.1), transparent)",
                transform: "rotate(45deg)",
                animation: `${gradientAnimation} 8s linear infinite`,
                zIndex: -1,
              },
            }}
          >
            <Fade in={true} timeout={1000}>
              <Box
                sx={{
                  position: "relative",
                  mb: 3,
                }}
              >
                <CameraAltOutlined
                  sx={{
                    fontSize: 80,
                    color: "#1E90FF",
                    animation: `${floatAnimation} 5s ease-in-out infinite`,
                    filter: "drop-shadow(0 0 8px rgba(30, 144, 255, 0.7))",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px 10px rgba(30, 144, 255, 0.4)",
                    animation: `${pulseAnimation} 3s infinite`,
                  }}
                />
              </Box>
            </Fade>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                mb: 1,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #1E90FF, #00BFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 10px rgba(30, 144, 255, 0.3)",
              }}
            >
              Light Lens
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 4, color: "rgba(255, 255, 255, 0.7)" }}
            >
              Capture your moments, share your vision
            </Typography>

            {error && (
              <Typography
                sx={{
                  mb: 2,
                  color: "#ff6b6b",
                  bgcolor: "rgba(255, 107, 107, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {error}
              </Typography>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", mt: 1 }}
            >
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Fingerprint sx={{ color: "#1E90FF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(30, 144, 255, 0.5)",
                      borderRadius: "12px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1E90FF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1E90FF",
                      boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#1E90FF",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    py: 1.5,
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VisibilityOff sx={{ color: "#1E90FF" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(30, 144, 255, 0.5)",
                      borderRadius: "12px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1E90FF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1E90FF",
                      boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#1E90FF",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    py: 1.5,
                  },
                }}
              />

              <GradientButton
                type="submit"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 3,
                  fontSize: "1.1rem",
                  animation: `${pulseAnimation} 3s infinite`,
                }}
              >
                Login
              </GradientButton>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#1E90FF",
                      textDecoration: "none",
                    },
                  }}
                >
                  Forgot password?
                </Link>
                <Link
                  href="/RegisterPage"
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#1E90FF",
                      textDecoration: "none",
                    },
                  }}
                >
                  Don't have an account? <strong>Sign Up</strong>
                </Link>
              </Box>

              <Divider sx={{ my: 4, color: "rgba(255, 255, 255, 0.3)" }}>
                OR CONTINUE WITH
              </Divider>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 3,
                    }}
                >
                    <IconButton
                        onClick={() => handleOAuthLogin("google")}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Google sx={{ color: "#DB4437" }} />
                    </IconButton>
                    <IconButton
                        onClick={() => handleOAuthLogin("github")}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <GitHub sx={{ color: "#ffffff" }} />
                    </IconButton>
                    <IconButton
                        onClick={() => handleOAuthLogin("facebook")}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <FacebookIcon sx={{ color: "#1877F2" }} />
                    </IconButton>
                </Box>
            </Box>
          </Paper>
        </Container>
      </Slide>
    </Box>
  );
}

export default Login;
