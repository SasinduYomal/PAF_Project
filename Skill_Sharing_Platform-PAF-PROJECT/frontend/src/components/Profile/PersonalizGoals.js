import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Avatar,
  Divider,
  Tooltip,
  Fab,
  Slider,
  Box,
  Badge,
  Grid,
  Card,
  CardContent,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  DateRange as DateIcon,
  School as SchoolIcon,
  EmojiEvents as AchievementsIcon,
  TrendingUp as ProgressIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Grade as GradeIcon,
  WorkspacePremium as PremiumIcon,
  Lightbulb as LightbulbIcon,
  Celebration as CelebrationIcon,
  AutoAwesome as AutoAwesomeIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import Sidebar from "../navigation pane/Sidebar";

// Color palettes
const lightColors = {
  primary: "#4361ee",
  secondary: "#3f37c9",
  success: "#4cc9f0",
  warning: "#f8961e",
  error: "#f72585",
  info: "#4895ef",
  dark: "#3a0ca3",
  light: "#f8f9fa",
};

const darkColors = {
  primary: "#4895ef",
  secondary: "#4361ee",
  success: "#4cc9f0",
  warning: "#f8961e",
  error: "#f72585",
  info: "#3f37c9",
  dark: "#3a0ca3",
  light: "#121212",
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 ${alpha(
    lightColors.success,
    0.7
  )}; }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px ${alpha(
    lightColors.success,
    0
  )}; }
  100% { transform: scale(1); box-shadow: 0 0 0 0 ${alpha(
    lightColors.success,
    0
  )}; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px ${alpha(lightColors.primary, 0.5)}; }
  50% { box-shadow: 0 0 20px ${alpha(lightColors.primary, 0.8)}; }
  100% { box-shadow: 0 0 5px ${alpha(lightColors.primary, 0.5)}; }
`;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  background:
    theme.palette.mode === "light"
      ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(
          theme.palette.primary.light,
          0.05
        )})`
      : theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const GoalCard = styled(Paper)(({ theme, completed }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  background: completed
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.success.main,
        0.08
      )}, ${alpha(theme.palette.success.main, 0.03)})`
    : `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.08
      )}, ${alpha(theme.palette.primary.main, 0.03)})`,
  borderLeft: `4px solid ${
    completed ? theme.palette.success.main : theme.palette.primary.main
  }`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[4],
  },
  ...(completed && {
    animation: `${pulse} 2s infinite`,
  }),
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 8,
  margin: theme.spacing(2, 0),
  backgroundColor: alpha(theme.palette.primary.light, 0.2),
  "& .MuiLinearProgress-bar": {
    borderRadius: 8,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    ...(value === 100 && {
      background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
    }),
  },
}));

const AchievementCard = styled(Card)(({ theme, unlocked }) => ({
  minWidth: 200,
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "visible",
  background: unlocked
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.success.main,
        0.1
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, ${alpha(theme.palette.grey[300], 0.1)}, ${alpha(
        theme.palette.grey[100],
        0.8
      )})`,
  border: unlocked
    ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
    : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
  boxShadow: unlocked
    ? `0 4px 20px ${alpha(theme.palette.success.main, 0.2)}`
    : "none",
  "&:hover": {
    transform: unlocked ? "translateY(-5px)" : "none",
    boxShadow: unlocked
      ? `0 10px 25px ${alpha(theme.palette.success.main, 0.3)}`
      : `0 4px 8px ${alpha(theme.palette.grey[400], 0.1)}`,
  },
  opacity: unlocked ? 1 : 0.8,
}));

const AchievementBadge = styled("div")(({ theme, unlocked }) => ({
  position: "absolute",
  top: -12,
  right: -12,
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[2],
  zIndex: 1,
  ...(unlocked && {
    animation: `${float} 3s ease-in-out infinite`,
  }),
}));

const FloatingAddButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: 32,
  right: 32,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
    animation: `${glow} 2s infinite`,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const achievementsData = [
  {
    id: 1,
    title: "First Step",
    description: "Complete your first goal",
    icon: <StarIcon sx={{ fontSize: 40 }} color="warning" />,
    threshold: 1,
  },
  {
    id: 2,
    title: "Quick Learner",
    description: "Complete 3 goals",
    icon: <RocketIcon sx={{ fontSize: 40 }} color="error" />,
    threshold: 3,
  },
  {
    id: 3,
    title: "Goal Achiever",
    description: "Complete 5 goals",
    icon: <GradeIcon sx={{ fontSize: 40 }} color="info" />,
    threshold: 5,
  },
  {
    id: 4,
    title: "Master Learner",
    description: "Complete 10 goals",
    icon: <PremiumIcon sx={{ fontSize: 40 }} color="primary" />,
    threshold: 10,
  },
  {
    id: 5,
    title: "Brilliant Mind",
    description: "Complete 15 goals",
    icon: <LightbulbIcon sx={{ fontSize: 40 }} color="warning" />,
    threshold: 15,
  },
  {
    id: 6,
    title: "Learning Champion",
    description: "Complete 20 goals",
    icon: <CelebrationIcon sx={{ fontSize: 40 }} color="error" />,
    threshold: 20,
  },
];

const PersonalizedLearningGoals = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    progress: 0,
    targetDate: "",
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Create theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? darkColors.primary : lightColors.primary,
      },
      secondary: {
        main: darkMode ? darkColors.secondary : lightColors.secondary,
      },
      success: {
        main: darkMode ? darkColors.success : lightColors.success,
      },
      warning: {
        main: darkMode ? darkColors.warning : lightColors.warning,
      },
      error: {
        main: darkMode ? darkColors.error : lightColors.error,
      },
      info: {
        main: darkMode ? darkColors.info : lightColors.info,
      },
      background: {
        default: darkMode ? darkColors.light : lightColors.light,
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  // Get current user on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  // Fetch goals when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchGoals();
    }
  }, [currentUser]);

  // Check for newly completed goals
  useEffect(() => {
    const newlyCompleted = goals.filter(
      (goal) => goal.progress === 100 && !goal.completed
    );
    if (newlyCompleted.length > 0) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.progress === 100 ? { ...goal, completed: true } : goal
        )
      );
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [goals]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/goals/user/${currentUser.id}`, {withCredentials: true}
      );
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value,
    });
  };

  const handleProgressChange = (event, newValue) => {
    setNewGoal({
      ...newGoal,
      progress: newValue,
    });
  };

  const handleEditProgressChange = (event, newValue) => {
    setEditingGoal({
      ...editingGoal,
      progress: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/goals", {
        ...newGoal,
        userId: currentUser.id,
      }, {withCredentials: true});
      setNewGoal({
        title: "",
        description: "",
        progress: 0,
        targetDate: "",
      });
      fetchGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleEditClick = (goal) => {
    setEditingGoal(goal);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/goals/${editingGoal.id}`,
        editingGoal,
          {withCredentials: true}
      );
      setOpenDialog(false);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteClick = (goal) => {
    setGoalToDelete(goal);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/goals/${goalToDelete.id}`, {withCredentials: true});
      setOpenDeleteDialog(false);
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const completedGoals = goals.filter((g) => g.progress === 100).length;
  const inProgressGoals = goals.filter((g) => g.progress < 100).length;

  if (!currentUser) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", bgcolor: "background.default" }}>
        <Sidebar />
        <Container maxWidth="md" sx={{ py: 4, ml: "180px" }}>
          {/* Celebration Animation */}
          {showCelebration && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  animation: `${float} 2s ease-in-out infinite`,
                  textAlign: "center",
                }}
              >
                <AutoAwesomeIcon
                  sx={{
                    fontSize: 120,
                    color: theme.palette.warning.main,
                    filter: "drop-shadow(0 0 8px rgba(248, 150, 30, 0.7))",
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.primary.dark,
                    fontWeight: "bold",
                    mt: 2,
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Goal Achieved!
                </Typography>
              </Box>
            </Box>
          )}

          {/* Header with dark mode toggle */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "white",
              p: 3,
              borderRadius: 3,
              mb: 4,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SchoolIcon sx={{ fontSize: 48, mr: 2 }} />
                {currentUser.username}'s Learning Journey
              </Typography>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", opacity: 0.9 }}
            >
              Track your progress and celebrate your achievements
            </Typography>
          </Box>

          {/* Add New Goal */}
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                color: theme.palette.text.primary,
              }}
            >
              <AddIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              Add New Learning Goal
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Goal Title"
                name="title"
                value={newGoal.title}
                onChange={handleInputChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newGoal.description}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  Initial Progress
                </Typography>
                <Slider
                  value={newGoal.progress}
                  onChange={handleProgressChange}
                  aria-labelledby="progress-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  sx={{
                    color: theme.palette.primary.main,
                    "& .MuiSlider-thumb": {
                      boxShadow: `0 0 0 8px ${alpha(
                        theme.palette.primary.main,
                        0.16
                      )}`,
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: `0 0 0 10px ${alpha(
                          theme.palette.primary.main,
                          0.25
                        )}`,
                      },
                    },
                  }}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 25, label: "25%" },
                    { value: 50, label: "50%" },
                    { value: 75, label: "75%" },
                    { value: 100, label: "100%" },
                  ]}
                />
              </Box>
              <TextField
                fullWidth
                label="Target Date"
                name="targetDate"
                type="date"
                value={newGoal.targetDate}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  mt: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
                  },
                }}
              >
                Add Goal
              </Button>
            </form>
          </StyledPaper>

          {/* Progress Summary */}
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: theme.palette.text.primary,
              }}
            >
              <ProgressIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              Progress Overview
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      color: theme.palette.getContrastText(
                        theme.palette.success.main
                      ),
                    }}
                  >
                    {completedGoals}
                  </Avatar>
                }
                label="Completed"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.main,
                  fontWeight: "bold",
                }}
              />
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.getContrastText(
                        theme.palette.primary.main
                      ),
                    }}
                  >
                    {inProgressGoals}
                  </Avatar>
                }
                label="In Progress"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                }}
              />
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.getContrastText(
                        theme.palette.secondary.main
                      ),
                    }}
                  >
                    {goals.length}
                  </Avatar>
                }
                label="Total Goals"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  fontWeight: "bold",
                }}
              />
            </Box>
            <ProgressBar
              variant="determinate"
              value={
                goals.length > 0 ? (completedGoals / goals.length) * 100 : 0
              }
            />
          </StyledPaper>

          {/* Goals List */}
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                color: theme.palette.text.primary,
              }}
            >
              <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              Current Learning Goals
            </Typography>
            {goals.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: theme.palette.text.secondary,
                }}
              >
                <LightbulbIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No goals yet
                </Typography>
                <Typography variant="body1">
                  Add your first learning goal to get started!
                </Typography>
              </Box>
            ) : (
              <List>
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    elevation={2}
                    completed={goal.progress === 100}
                  >
                    <ListItem disablePadding>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: theme.palette.text.primary,
                            }}
                          >
                            {goal.title}
                            {goal.progress === 100 && (
                              <CheckIcon
                                sx={{
                                  ml: 1,
                                  verticalAlign: "middle",
                                  color: theme.palette.success.main,
                                }}
                              />
                            )}
                          </Typography>
                        }
                        secondary={
                          <>
                            {goal.description && (
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 1 }}
                              >
                                {goal.description}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <DateIcon
                                sx={{
                                  mr: 1,
                                  fontSize: 16,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Target:{" "}
                                {new Date(goal.targetDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit Goal">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditClick(goal)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Goal">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteClick(goal)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mr: 2 }}
                      >
                        Progress: {goal.progress}%
                      </Typography>
                      <ProgressBar
                        variant="determinate"
                        value={goal.progress}
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                    {goal.progress === 100 && (
                      <Box sx={{ mt: 1, textAlign: "center" }}>
                        <Chip
                          icon={<CelebrationIcon />}
                          label="Goal Achieved!"
                          sx={{
                            fontWeight: "bold",
                            background: alpha(theme.palette.success.main, 0.2),
                            color: theme.palette.success.main,
                          }}
                        />
                      </Box>
                    )}
                  </GoalCard>
                ))}
              </List>
            )}
          </StyledPaper>

          {/* Achievements Section */}
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                color: theme.palette.text.primary,
              }}
            >
              <AchievementsIcon
                sx={{ color: theme.palette.primary.main, mr: 1 }}
              />
              Learning Achievements
            </Typography>
            <Grid container spacing={3}>
              {achievementsData.map((achievement) => {
                const unlocked = completedGoals >= achievement.threshold;
                return (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <AchievementCard unlocked={unlocked}>
                      {unlocked && (
                        <AchievementBadge unlocked={unlocked}>
                          <CheckIcon fontSize="small" />
                        </AchievementBadge>
                      )}
                      <CardContent sx={{ textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>{achievement.icon}</Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: "bold",
                            color: unlocked
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          }}
                        >
                          {achievement.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: unlocked
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                            mb: 2,
                          }}
                        >
                          {achievement.description}
                        </Typography>
                        <Chip
                          label={`${achievement.threshold}+ Goals`}
                          variant="outlined"
                          size="small"
                          sx={{
                            mt: 1,
                            borderColor: unlocked
                              ? theme.palette.success.main
                              : theme.palette.divider,
                            color: unlocked
                              ? theme.palette.success.main
                              : theme.palette.text.secondary,
                          }}
                        />
                      </CardContent>
                    </AchievementCard>
                  </Grid>
                );
              })}
            </Grid>
            {completedGoals === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: theme.palette.text.secondary,
                }}
              >
                <AchievementsIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No achievements yet
                </Typography>
                <Typography variant="body1">
                  Complete your first goal to unlock achievements!
                </Typography>
              </Box>
            )}
          </StyledPaper>

          {/* Floating Add Button */}
          <FloatingAddButton
            color="primary"
            aria-label="add"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <AddIcon />
          </FloatingAddButton>

          {/* Edit Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            TransitionComponent={Transition}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                fontWeight: "bold",
              }}
            >
              <EditIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Edit Learning Goal
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <form onSubmit={handleUpdate}>
                <TextField
                  fullWidth
                  label="Goal Title"
                  name="title"
                  value={editingGoal?.title || ""}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, title: e.target.value })
                  }
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editingGoal?.description || ""}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      description: e.target.value,
                    })
                  }
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography gutterBottom>Progress</Typography>
                  <Slider
                    value={editingGoal?.progress || 0}
                    onChange={handleEditProgressChange}
                    aria-labelledby="edit-progress-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    sx={{
                      color: theme.palette.primary.main,
                      "& .MuiSlider-thumb": {
                        boxShadow: `0 0 0 8px ${alpha(
                          theme.palette.primary.main,
                          0.16
                        )}`,
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0 0 0 10px ${alpha(
                            theme.palette.primary.main,
                            0.25
                          )}`,
                        },
                      },
                    }}
                    marks={[
                      { value: 0, label: "0%" },
                      { value: 25, label: "25%" },
                      { value: 50, label: "50%" },
                      { value: 75, label: "75%" },
                      { value: 100, label: "100%" },
                    ]}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Target Date"
                  name="targetDate"
                  type="date"
                  value={
                    editingGoal?.targetDate
                      ? editingGoal.targetDate.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      targetDate: e.target.value,
                    })
                  }
                  margin="normal"
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                />
              </form>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{ color: theme.palette.text.secondary }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Update Goal
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            TransitionComponent={Transition}
            PaperProps={{
              sx: {
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.error.main,
                color: theme.palette.common.white,
                fontWeight: "bold",
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ mt: 2 }}>
                Are you sure you want to delete the goal "{goalToDelete?.title}
                "?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: theme.palette.text.secondary }}
              >
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                sx={{ color: theme.palette.text.secondary }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PersonalizedLearningGoals;
