import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Collapse,
  Badge,
  Divider,
  Box,
  Tooltip,
  keyframes,
  styled,
} from "@mui/material";
import {
  Home,
  Search,
  Explore,
  Movie,
  Chat,
  Favorite,
  AddBox,
  MoreHoriz,
  Logout,
  EmojiEvents as GoalsIcon,
  Settings,
  AccountCircle,
} from "@mui/icons-material";
import axios from "axios";

// Advanced Light Lens Animation Keyframes
const lightBeam = keyframes`
  0% {
    text-shadow: 
      0 0 2px #fff,
      0 0 5px rgba(100, 200, 255, 0.8),
      0 0 10px rgba(0, 150, 255, 0.6),
      0 0 20px rgba(0, 100, 255, 0.4),
      0 0 30px rgba(0, 80, 255, 0.2);
    background-position: 0% 50%;
  }
  25% {
    text-shadow: 
      0 0 3px #fff,
      0 0 8px rgba(100, 220, 255, 0.9),
      0 0 15px rgba(0, 180, 255, 0.7),
      0 0 25px rgba(0, 120, 255, 0.5),
      0 0 35px rgba(0, 90, 255, 0.3);
  }
  50% {
    text-shadow: 
      0 0 4px #fff,
      0 0 10px rgba(120, 230, 255, 1),
      0 0 20px rgba(50, 200, 255, 0.8),
      0 0 30px rgba(0, 150, 255, 0.6),
      0 0 40px rgba(0, 100, 255, 0.4);
    background-position: 100% 50%;
  }
  75% {
    text-shadow: 
      0 0 3px #fff,
      0 0 8px rgba(100, 220, 255, 0.9),
      0 0 15px rgba(0, 180, 255, 0.7),
      0 0 25px rgba(0, 120, 255, 0.5),
      0 0 35px rgba(0, 90, 255, 0.3);
  }
  100% {
    text-shadow: 
      0 0 2px #fff,
      0 0 5px rgba(100, 200, 255, 0.8),
      0 0 10px rgba(0, 150, 255, 0.6),
      0 0 20px rgba(0, 100, 255, 0.4),
      0 0 30px rgba(0, 80, 255, 0.2);
    background-position: 0% 50%;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.02);
  }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Styled Components
const BrandContainer = styled(Box)({
  position: "relative",
  padding: "16px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.5), transparent)",
    animation: `${fadeIn} 1s ease-out`,
  },
});

const AnimatedBrand = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.8rem",
  textAlign: "center",
  marginBottom: theme.spacing(1),
  background: "linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `
    ${lightBeam} 6s ease-in-out infinite,
    ${floatAnimation} 8s ease-in-out infinite
  `,
  transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  position: "relative",
  padding: "8px 0",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "25%",
    width: "50%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #00d2ff, transparent)",
    opacity: 0,
    transition: "all 0.3s ease",
  },
  "&:hover": {
    animation: `
      ${lightBeam} 3s ease-in-out infinite,
      ${floatAnimation} 4s ease-in-out infinite
    `,
    transform: "scale(1.05)",
    "&::after": {
      opacity: 1,
      transform: "scaleX(1.1)",
    },
  },
}));

const AnimatedListItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  margin: theme.spacing(0.5, 1),
  backgroundColor: active ? "rgba(0, 180, 255, 0.1)" : "transparent",
  borderLeft: active ? `3px solid #00d2ff` : "3px solid transparent",
  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
  "&:hover": {
    backgroundColor: active
      ? "rgba(0, 180, 255, 0.2)"
      : "rgba(255, 255, 255, 0.05)",
    transform: "translateX(5px)",
    borderLeft: `3px solid ${active ? "#00d2ff" : "rgba(0, 180, 255, 0.5)"}`,
    boxShadow: active
      ? "0 4px 8px rgba(0, 180, 255, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  "& .MuiListItemIcon-root": {
    minWidth: "40px",
    color: active ? "#00d2ff" : theme.palette.common.white,
    transition: "all 0.3s ease",
  },
  "&:hover .MuiListItemIcon-root": {
    transform: "scale(1.15) rotate(5deg)",
    color: "#00d2ff",
  },
  "& .MuiListItemText-primary": {
    fontWeight: active ? 600 : 400,
    transition: "all 0.3s ease",
  },
  "&:hover .MuiListItemText-primary": {
    fontWeight: 600,
  },
}));

const Sidebar = ({ userId }) => {
  const [openMore, setOpenMore] = useState(false);
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, goalsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${userId}`),
          axios.get(`http://localhost:8080/api/goals/user/${userId}`),
        ]);

        setUserData(userResponse.data);
        setCompletedGoalsCount(
          goalsResponse.data.filter((goal) => goal.progress === 100).length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleMoreClick = () => setOpenMore(!openMore);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/LoginPage");
  };
  const handleNavigation = (path) => navigate(path);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search", path: "/search" },
    { icon: <Explore />, text: "Explore", path: "/explore" },
    { icon: <Movie />, text: "Reels", path: "/reels" },
    { icon: <Chat />, text: "Messages", path: "/messages" },
    { icon: <Favorite />, text: "Notifications", path: "/notifications" },
    { icon: <AddBox />, text: "Create", path: "/create" },
    {
      icon: (
        <Badge
          badgeContent={completedGoalsCount}
          color="success"
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              right: 5,
              top: 5,
              border: `2px solid #000`,
              padding: "0 4px",
              fontWeight: "bold",
              animation: `${floatAnimation} 2s ease-in-out infinite`,
            },
          }}
        >
          <GoalsIcon />
        </Badge>
      ),
      text: "Goals",
      path: "/PersonalizGoals",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "#0a0a0a",
          color: "#fff",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          animation: `${fadeIn} 0.8s ease-out`,
          boxShadow: "inset -5px 0 15px -10px rgba(0, 180, 255, 0.3)",
        },
      }}
    >
      <BrandContainer>
        <AnimatedBrand variant="h1">Light Lens</AnimatedBrand>
        <Divider
          sx={{
            backgroundColor: "transparent",
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.3), transparent)",
            height: "1px",
            border: "none",
            mb: 2,
          }}
        />
      </BrandContainer>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <Tooltip
            key={item.text}
            title={item.text}
            placement="right"
            arrow
            enterDelay={300}
            leaveDelay={200}
          >
            <AnimatedListItem
              onClick={() => handleNavigation(item.path)}
              active={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              />
            </AnimatedListItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ p: 2, position: "relative" }}>
        <Divider
          sx={{
            backgroundColor: "transparent",
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.3), transparent)",
            height: "1px",
            border: "none",
            mb: 2,
          }}
        />

        {/* Profile Section */}
        <Tooltip title="Profile" placement="right" arrow>
          <AnimatedListItem
            onClick={() => handleNavigation("/UserProfile")}
            active={isActive("/profile")}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: userData?.avatarColor || "#00d2ff",
                  transition: "all 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: isActive("/profile")
                    ? "0 0 10px rgba(0, 210, 255, 0.7)"
                    : "none",
                  "&:hover": {
                    transform: "scale(1.1) rotate(5deg)",
                    boxShadow: "0 0 15px rgba(0, 210, 255, 0.9)",
                  },
                }}
                src={userData?.profilePicture}
              >
                {userData?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={userData?.username || "Profile"}
              primaryTypographyProps={{
                fontWeight: isActive("/profile") ? 600 : 400,
                noWrap: true,
              }}
            />
          </AnimatedListItem>
        </Tooltip>

        {/* More Options */}
        <AnimatedListItem
          onClick={handleMoreClick}
          sx={{
            "& .MuiListItemIcon-root": {
              color: openMore ? "#00d2ff" : "inherit",
            },
          }}
        >
          <ListItemIcon>
            <MoreHoriz />
          </ListItemIcon>
          <ListItemText primary="More" />
        </AnimatedListItem>

        <Collapse
          in={openMore}
          timeout="auto"
          unmountOnExit
          sx={{
            "& .MuiCollapse-wrapperInner": {
              animation: `${fadeIn} 0.4s ease-out`,
            },
          }}
        >
          <List component="div" disablePadding>
            <AnimatedListItem
              onClick={() => handleNavigation("/settings")}
              active={isActive("/settings")}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </AnimatedListItem>

            <AnimatedListItem
              onClick={handleLogout}
              sx={{
                pl: 4,
                "&:hover": {
                  backgroundColor: "rgba(255, 50, 50, 0.1)",
                  "& .MuiListItemIcon-root": {
                    color: "#ff5252",
                  },
                },
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                primaryTypographyProps={{ color: "#ff5252" }}
              />
            </AnimatedListItem>
          </List>
        </Collapse>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
