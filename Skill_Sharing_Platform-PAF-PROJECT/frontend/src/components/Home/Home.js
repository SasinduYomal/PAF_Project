import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Container,
    Button,
    Grid,
    IconButton,
    Divider,
    Card,
    CardContent,
    Avatar,
    Chip,
    TextField, Menu, MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import {
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Landscape as LandscapeIcon,
  Event as EventIcon,
  Face as PortraitIcon,
  PhotoCamera as PhotoCameraIcon,
  Login as LoginIcon,
  Instagram,
  Facebook,
  Twitter,
  Pinterest,
  Favorite,
  Share,
  Comment,
  Explore,
  Collections,
  Settings,
  Notifications,
} from "@mui/icons-material";

// Animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const photoPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3); }
  50% { transform: scale(1.03); box-shadow: 0 8px 25px rgba(33, 150, 243, 0.5); }
  100% { transform: scale(1); box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3); }
`;

const rippleAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const textGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Animated Logo Component
const AnimatedLogo = ({ size = "medium" }) => {
  const sizes = {
    small: { icon: 24, text: "h6" },
    medium: { icon: 32, text: "h5" },
    large: { icon: 48, text: "h4" },
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* Animated Camera Icon */}
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <CameraIcon
          sx={{
            fontSize: sizes[size].icon,
            color: "#2196f3",
            mr: 1,
            animation: `${pulse} 3s infinite ease-in-out`,
          }}
        />
      </motion.div>

      {/* Animated Text */}
      <Typography
        variant={sizes[size].text}
        sx={{
          fontWeight: "bold",
          background:
            "linear-gradient(90deg, #2196f3, #00bcd4, #ff4081, #2196f3)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `${textGradient} 8s ease infinite`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -5,
            left: 0,
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, #2196f3, #00bcd4)",
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s ease",
          },
          "&:hover::after": {
            transform: "scaleX(1)",
          },
        }}
      >
        Light Lens
      </Typography>
    </Box>
  );
};

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/UserProfile");
        }
    }, [navigate]);

    // Sample data
    const trendingPhotographers = [
        {
            id: 1,
            name: "Alex Morgan",
            avatar: "A",
            specialty: "Portrait",
            followers: "12.4k",
        },
        {
            id: 2,
            name: "Jamie Chen",
            avatar: "J",
            specialty: "Landscape",
            followers: "8.7k",
        },
        {
            id: 3,
            name: "Sam Wilson",
            avatar: "S",
            specialty: "Street",
            followers: "15.2k",
        },
    ];

    const trendingPhotos = [
        { id: 1, title: "Golden Hour", likes: 1243, comments: 87 },
        { id: 2, title: "Urban Jungle", likes: 892, comments: 45 },
        { id: 3, title: "Mountain Peak", likes: 1567, comments: 112 },
    ];

    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // On component mount, check localStorage first before fetching from the backend.
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            fetch("http://localhost:8080/users/user/me", {
                credentials: "include", // Important for cookies/session
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser(data.user);
                        // Save user data in localStorage for persistent login
                        localStorage.setItem("user", JSON.stringify(data.user));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err);
                });
        }
    }, []);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Logout function: clear frontend states and storage, then redirect.
    const handleLogout = () => {
        fetch("http://localhost:8080/users/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    localStorage.removeItem("user");
                    setUser(null);
                    navigate("/LoginPage");
                } else {
                    console.error("Logout failed:", response.status);
                }
            })
            .catch((err) => {
                console.error("Logout error:", err);
            });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(-45deg, #0f0c29, #302b63, #24243e)",
                backgroundSize: "400% 400%",
                animation: `${gradientAnimation} 15s ease infinite`,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Header/Navbar */}
            <Box
                sx={{
                    width: "100%",
                    py: 2,
                    px: { xs: 2, md: 6 },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(15, 12, 41, 0.8)",
                    backdropFilter: "blur(10px)",
                    zIndex: 10,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <AnimatedLogo size="medium" />
                </motion.div>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                            startIcon={<Explore />}
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                "&:hover": { color: "#2196f3" },
                            }}
                        >
                            Explore
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                            startIcon={<Collections />}
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                "&:hover": { color: "#2196f3" },
                            }}
                        >
                            Collections
                        </Button>
                    </motion.div>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        <Notifications />
                    </IconButton>
                    {user ? (
                        <div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Avatar
                                    alt={user.name}
                                    src={user.picture}
                                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                                    onClick={handleAvatarClick}
                                />
                            </motion.div>
                            {/* Dropdown menu for logout */}
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                startIcon={<LoginIcon />}
                                sx={{
                                    backgroundColor: "#2196f3",
                                    "&:hover": { backgroundColor: "#1976d2" },
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                }}
                                onClick={() => navigate("/LoginPage")}
                            >
                                Sign In
                            </Button>
                        </motion.div>
                    )}
                </Box>
            </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          py: 6,
          flex: 1,
          position: "relative",
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
            mb: 10,
          }}
        >
          <Box sx={{ flex: 1, position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Share Your <span style={{ color: "#2196f3" }}>Vision</span> With
                The World
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 4,
                  fontWeight: "normal",
                }}
              >
                Join millions of photographers showcasing their work,
                discovering inspiration, and connecting with creatives
                worldwide.
              </Typography>
              <Box sx={{ display: "flex", gap: 3, mt: 4 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#2196f3",
                      "&:hover": { backgroundColor: "#1976d2" },
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Get Started - It's Free
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "#ffffff",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": { borderColor: "#2196f3" },
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    See How It Works
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1, position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: "relative", height: "100%" }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "500px" },
                  borderRadius: "24px",
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    animation: `${photoPulse} 8s infinite ease-in-out`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "12px",
                    p: 2,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#ffffff" }}>
                    Concert Photography
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    By @musicphotographer
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Favorite
                        sx={{ fontSize: 18, color: "#ff4081", mr: 0.5 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        2.4k
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Comment
                        sx={{ fontSize: 18, color: "#2196f3", mr: 0.5 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        143
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Decorative floating photos */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: -30,
                  right: { xs: -20, md: 50 },
                  zIndex: -1,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "12px",
                    backgroundColor: "#ff9800",
                    transform: "rotate(15deg)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: { xs: -20, md: 50 },
                  zIndex: -1,
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "12px",
                    backgroundColor: "#4caf50",
                    transform: "rotate(-10deg)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </motion.div>
            </motion.div>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            borderRadius: "24px",
            p: 4,
            mb: 10,
            border: "1px solid rgba(33, 150, 243, 0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {[
              { value: "10M+", label: "Photos Shared" },
              { value: "2M+", label: "Community Members" },
              { value: "500K+", label: "Daily Inspirations" },
              { value: "100+", label: "Countries" },
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        color: "#2196f3",
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontWeight: "medium",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Trending Photographers */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 4,
                textAlign: "center",
              }}
            >
              Trending Photographers
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {trendingPhotographers.map((photographer, index) => (
              <Grid item xs={12} sm={6} md={4} key={photographer.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "16px",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 15px 30px rgba(33, 150, 243, 0.3)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                      <Box
                        sx={{ position: "relative", display: "inline-block" }}
                      >
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            fontSize: "2.5rem",
                            bgcolor: "#2196f3",
                            mb: 2,
                          }}
                        >
                          {photographer.avatar}
                        </Avatar>
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: "50%",
                            border: "2px solid #2196f3",
                            animation: `${rippleAnimation} 2s infinite`,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: "#ffffff",
                          mb: 1,
                        }}
                      >
                        {photographer.name}
                      </Typography>
                      <Chip
                        label={photographer.specialty}
                        sx={{
                          backgroundColor: "rgba(33, 150, 243, 0.2)",
                          color: "#2196f3",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          mb: 2,
                        }}
                      >
                        {photographer.followers} followers
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          color: "#2196f3",
                          borderColor: "#2196f3",
                          "&:hover": {
                            backgroundColor: "rgba(33, 150, 243, 0.1)",
                          },
                          borderRadius: "12px",
                          textTransform: "none",
                        }}
                      >
                        View Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Trending Photos */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 4,
                textAlign: "center",
              }}
            >
              Trending This Week
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {trendingPhotos.map((photo, index) => (
              <Grid item xs={12} sm={4} key={photo.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      backgroundColor: "transparent",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        height: "300px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={`https://source.unsplash.com/random/600x400/?photography,${index}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 3,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          {photo.title}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Favorite
                              sx={{ fontSize: 18, color: "#ff4081", mr: 0.5 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {photo.likes.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Comment
                              sx={{ fontSize: 18, color: "#2196f3", mr: 0.5 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {photo.comments}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 6,
                textAlign: "center",
              }}
            >
              Why Photographers Love <AnimatedLogo size="small" />
            </Typography>
          </motion.div>
          <Grid container spacing={6}>
            {[
              {
                icon: (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(145deg, #2196f3, #00bcd4)",
                      boxShadow: "0 8px 24px rgba(33, 150, 243, 0.4)",
                      mb: 3,
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 40, color: "#ffffff" }} />
                  </Box>
                ),
                title: "Powerful Portfolio",
                description:
                  "Showcase your work in stunning, customizable galleries that highlight your unique style.",
              },
              {
                icon: (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(145deg, #ff4081, #ff9100)",
                      boxShadow: "0 8px 24px rgba(255, 64, 129, 0.4)",
                      mb: 3,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40, color: "#ffffff" }} />
                  </Box>
                ),
                title: "Engaged Community",
                description:
                  "Connect with millions of photography enthusiasts and professionals worldwide.",
              },
              {
                icon: (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(145deg, #4caf50, #8bc34a)",
                      boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
                      mb: 3,
                    }}
                  >
                    <Settings sx={{ fontSize: 40, color: "#ffffff" }} />
                  </Box>
                ),
                title: "Advanced Tools",
                description:
                  "Our professional-grade tools help you organize, edit, and share your work effortlessly.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "24px",
                      p: 4,
                      height: "100%",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      {feature.icon}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: "#ffffff",
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Final CTA */}
        <Box
          sx={{
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            borderRadius: "24px",
            p: 6,
            textAlign: "center",
            border: "1px solid rgba(33, 150, 243, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                mb: 3,
              }}
            >
              Ready to Share Your <span style={{ color: "#2196f3" }}>Art</span>{" "}
              With the World?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              Join our community of passionate photographers today. It's free
              and always will be.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<CameraIcon />}
                sx={{
                  backgroundColor: "#2196f3",
                  "&:hover": { backgroundColor: "#1976d2" },
                  borderRadius: "12px",
                  px: 6,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Start Your Photography Journey
              </Button>
            </motion.div>
          </motion.div>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "rgba(15, 12, 41, 0.9)",
          py: 6,
          px: { xs: 2, md: 6 },
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AnimatedLogo size="small" />
              </Box>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
              >
                The world's premier photography community and portfolio
                platform.
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {[
                  { icon: <Instagram />, color: "#E1306C" },
                  { icon: <Facebook />, color: "#4267B2" },
                  { icon: <Twitter />, color: "#1DA1F2" },
                  { icon: <Pinterest />, color: "#E60023" },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "&:hover": { backgroundColor: social.color },
                        color: "#ffffff",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: "bold", mb: 2 }}
              >
                For Photographers
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  "Portfolio",
                  "Discover Work",
                  "Challenges",
                  "Jobs",
                  "Pricing",
                ].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": { color: "#2196f3", cursor: "pointer" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: "bold", mb: 2 }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["About", "Careers", "Support", "Search", "Press"].map(
                  (item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": { color: "#2196f3", cursor: "pointer" },
                      }}
                    >
                      {item}
                    </Typography>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: "bold", mb: 2 }}
              >
                Newsletter
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
              >
                Subscribe to get photography tips and inspiration straight to
                your inbox.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  placeholder="Your email address"
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#2196f3",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2196f3",
                      },
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#ffffff",
                    },
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#2196f3",
                      "&:hover": { backgroundColor: "#1976d2" },
                      borderRadius: "12px",
                      px: 3,
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    Subscribe
                  </Button>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.5)", textAlign: "center" }}
          >
            © {new Date().getFullYear()} CaptureLife. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
