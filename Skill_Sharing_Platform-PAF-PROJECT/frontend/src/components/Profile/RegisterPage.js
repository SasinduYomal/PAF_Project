import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  CameraAltOutlined,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Cake,
  Transgender,
} from "@mui/icons-material";
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

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    mobile: "",
    dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/users/register", user);
      alert("User registered successfully");
      navigate("/LoginPage");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

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
              padding: { xs: 3, md: 4 },
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
                  mb: 2,
                }}
              >
                <CameraAltOutlined
                  sx={{
                    fontSize: 70,
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
              Join Light Lens
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
            >
              Create your account to start sharing your vision
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
                value={user.username}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#1E90FF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
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
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#1E90FF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
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
                value={user.password}
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
                  mb: 2,
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
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
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
                    "& .MuiSelect-icon": {
                      color: "#ffffff",
                    },
                  }}
                >
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    label="Gender"
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        <Transgender sx={{ color: "#1E90FF", mr: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      color: "#ffffff",
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#1E90FF" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Box>
              <TextField
                fullWidth
                margin="normal"
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={user.dateOfBirth}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake sx={{ color: "#1E90FF" }} />
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
                  mb: 2,
                  fontSize: "1.1rem",
                  animation: `${pulseAnimation} 3s infinite`,
                }}
              >
                Create Account
              </GradientButton>

              <Divider sx={{ my: 2, color: "rgba(255, 255, 255, 0.3)" }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/LoginPage"
                    sx={{
                      color: "#1E90FF",
                      fontWeight: "bold",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Slide>
    </Box>
  );
}

export default Register;
