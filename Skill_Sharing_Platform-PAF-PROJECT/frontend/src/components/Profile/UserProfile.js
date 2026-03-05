import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {
    Button,
    TextField,
    Avatar,
    Typography,
    Box,
    Container,
    Grid,
    Collapse,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ThemeProvider,
    createTheme,
    CssBaseline,
    CircularProgress,
    Snackbar,
    Alert,
    Paper,
    Divider,
    Fade,
    Grow,
    Zoom,
    Slide,
    Card,
    CardContent,
    Chip, CardActions,
    Tabs,
    Tab,
} from "@mui/material";
import Sidebar from "../navigation pane/Sidebar";
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Cake as CakeIcon,
    Phone as PhoneIcon,
    Description as DescriptionIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    CameraAlt as CameraAltIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import {getPostMediaUrl} from "../../utils/media";

// Custom theme with beautiful colors
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                // Light mode colors
                primary: {
                    main: "#3f51b5",
                    light: "#757de8",
                    dark: "#002984",
                    contrastText: "#fff",
                },
                secondary: {
                    main: "#f50057",
                    light: "#ff4081",
                    dark: "#c51162",
                    contrastText: "#fff",
                },
                background: {
                    default: "#f5f5f5",
                    paper: "#ffffff",
                },
                text: {
                    primary: "#212121",
                    secondary: "#757575",
                },
            }
            : {
                // Dark mode colors
                primary: {
                    main: "#bb86fc",
                    light: "#d1c4e9",
                    dark: "#3700b3",
                    contrastText: "#000",
                },
                secondary: {
                    main: "#03dac6",
                    light: "#66fff9",
                    dark: "#00a895",
                    contrastText: "#000",
                },
                background: {
                    default: "#121212",
                    paper: "#1e1e1e",
                },
                text: {
                    primary: "#e0e0e0",
                    secondary: "#a0a0a0",
                },
            }),
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h5: {
            fontWeight: 700,
            letterSpacing: 0.5,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "8px 16px",
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    width: 150,
                    height: 150,
                    fontSize: "3.5rem",
                    border: "3px solid",
                    borderColor: mode === "light" ? "#3f51b5" : "#bb86fc",
                    boxShadow:
                        mode === "light"
                            ? "0 4px 12px rgba(0,0,0,0.1)"
                            : "0 4px 12px rgba(0,0,0,0.3)",
                },
            },
        },
    },
});

// Date formatting utility function
const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    const options = {day: "numeric", month: "long", year: "numeric"};
    return date.toLocaleDateString("en-US", options);
};

function UserProfile() {
    const [postFiles, setPostFiles] = useState([]);
    const [postDescription, setPostDescription] = useState("");
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [showAbout, setShowAbout] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openEditPostDialog, setOpenEditPostDialog] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [editingPost, setEditingPost] = useState(null);
    const [editPostDescription, setEditPostDescription] = useState("");
    const [editPostFiles, setEditPostFiles] = useState([]);

    const navigate = useNavigate();

    // Theme configuration
    const appTheme = createTheme(getDesignTokens(darkMode ? "dark" : "light"));

    // Load user data and preferences
    useEffect(() => {
        const loadUserData = async () => {
            const loggedUser = JSON.parse(localStorage.getItem("user"));
            console.log(loggedUser)
            if (!loggedUser) {
                navigate("/login");
            } else {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `http://localhost:8080/users/${loggedUser.id}`, {withCredentials: true}
                    );
                    setUser(response.data);
                    setUpdatedUser(response.data);
                    setPosts(response.data.posts);
                    setFollowersCount(response.data.followerCount || 0);
                    setFollowingCount(response.data.followingCount || 0);
                } catch (error) {
                    showSnackbar("Error loading user data", "error");
                } finally {
                    setLoading(false);
                }
            }
        };

        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(savedDarkMode);
        loadUserData();
    }, [navigate]);

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    function isImageFile(fileName) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    }
    const isVideoFile = (fileName) => /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(fileName);

    const showSnackbar = (message, severity) => {
        setSnackbar({open: true, message, severity});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false});
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode);
    };

    const handleChange = (e) => {
        setUpdatedUser({...updatedUser, [e.target.name]: e.target.value});
    };

    const handleUpdate = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userDetails", JSON.stringify(updatedUser));

            if (selectedImage) {
                formData.append("file", selectedImage);
            }

            const response = await axios.put(
                `http://localhost:8080/users/${user.id}`,
                formData,
                {headers: {"Content-Type": "multipart/form-data"}, withCredentials: true,},
            );

            setUser(response.data);
            setUpdatedUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            setOpenEditDialog(false);
            setSelectedImage(null);
            showSnackbar("Profile updated successfully", "success");
        } catch (error) {
            showSnackbar("Error updating profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user?.id) return;

        if (!window.confirm("Are you sure you want to delete your profile?"))
            return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/users/${user.id}`, {withCredentials: true});
            localStorage.clear();
            sessionStorage.clear();
            showSnackbar("Profile deleted successfully", "success");
            navigate("/");
        } catch (error) {
            showSnackbar("Error deleting profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.id) return;

        if (!file.type.match("image.*")) {
            showSnackbar("Please select an image file", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showSnackbar("Image size should be less than 5MB", "error");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `http://localhost:8080/users/${user.id}/upload`,
                formData,
                {headers: {"Content-Type": "multipart/form-data"}, withCredentials: true,}
            );

            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            showSnackbar("Profile picture updated successfully", "success");
        } catch (error) {
            showSnackbar("Error uploading image", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePostUpload = async (e) => {
        if (!user?.id) return;

        // 1. Grab the files straight from the input
        const selectedFiles = Array.from(e.target.files);

        // 2. Keep them in state only if other      parts of the UI need them
        setPostFiles(selectedFiles);

        // ---- validation -------------------------------------------------
        if (selectedFiles.length === 0) {
            showSnackbar("Please select at least one file", "error");
            return;
        }
        if (selectedFiles.length > 3) {
            showSnackbar("You can upload a maximum of 3 files per post", "error");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("files", file));
            if (postDescription.trim()) {
                formData.append("description", postDescription.trim());
            }

            await axios.post(
                `http://localhost:8080/posts/${user.id}/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            // 3. Clean up
            setPostFiles([]);
            setPostDescription("");
            e.target.value = "";
            showSnackbar("Post uploaded successfully", "success");
            navigate("/");
        } catch (err) {
            showSnackbar("Error uploading post", "error");
        } finally {
            setLoading(false);
        }
    };

    // Called when user clicks the Edit button on a post.
    const handleEditPost = (post) => {
        setEditingPost(post);
        setEditPostDescription(post.description);
        setEditPostFiles([]);
        setOpenEditPostDialog(true);
    };

    // Handle new file selection for editing a post.
    const handleEditPostFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            showSnackbar("You can upload a maximum of 3 files per post", "error");
            return;
        }
        setEditPostFiles(files);
    };

    // Submit the edited post data to the backend.
    const handleEditPostSubmit = async () => {
        if (!editingPost?.id) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("description", editPostDescription);
            // Only add files if the user selected new ones
            if (editPostFiles.length > 0) {
                editPostFiles.forEach((file) => formData.append("files", file));
            }

            await axios.put(
                `http://localhost:8080/posts/${editingPost.id}/edit`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            showSnackbar("Post updated successfully", "success");

            // Optionally, update the post in your local state.
            const updatedPosts = posts.map((p) =>
                p.id === editingPost.id
                    ? { ...p, description: editPostDescription }
                    : p
            );
            setPosts(updatedPosts);

            // Close the dialog.
            setOpenEditPostDialog(false);
            setEditingPost(null);
        } catch (error) {
            showSnackbar("Error updating post", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/posts/${postId}`, {withCredentials: true});
            // Update posts state after deletion
            setPosts(posts.filter(post => post.id !== postId));
            showSnackbar("Post deleted successfully", "success");
        } catch (error) {
            showSnackbar("Error deleting post", "error");
        } finally {
            setLoading(false);
        }
    };

    const getPostImageUrl = (filename, postId, index) => {
        if (!filename) return "/placeholder.jpg";
        return `http://localhost:8080/users/uploads/${filename}?v=${postId}-${index}`;
    };

    // Tab state: 0 for Image Posts; 1 for Video Posts
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Filter posts into image posts and video posts.
    const imagePosts = posts.filter(
        (post) =>
            post.mediaFiles &&
            post.mediaFiles.some((file) => isImageFile(file))
    );

    const videoPosts = posts.filter(
        (post) =>
            post.mediaFiles &&
            post.mediaFiles.some((file) => isVideoFile(file))
    );

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline/>
            <Box display="flex" minHeight="100vh">
                <Sidebar/>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        marginLeft: {sm: "30px"},
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        background: appTheme.palette.background.default,
                    }}
                >
                    <Container maxWidth="lg" sx={{mt: 4}}>
                        {/* Dark Mode Toggle */}
                        <Fade in={true} timeout={800}>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    onClick={toggleDarkMode}
                                    color="inherit"
                                    sx={{
                                        backgroundColor: appTheme.palette.background.paper,
                                        boxShadow: appTheme.shadows[2],
                                        "&:hover": {
                                            backgroundColor: appTheme.palette.action.hover,
                                        },
                                    }}
                                >
                                    {darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                                </IconButton>
                            </Box>
                        </Fade>

                        {loading && (
                            <Box display="flex" justifyContent="center" my={4}>
                                <CircularProgress color="secondary"/>
                            </Box>
                        )}

                        {user && !loading && (
                            <Grow in={true} timeout={1000}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={5} lg={4}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                background: appTheme.palette.background.paper,
                                            }}
                                        >
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Zoom in={true} timeout={1200}>
                                                    <Box
                                                        sx={{
                                                            position: "relative",
                                                            width: 120,
                                                            height: 120,
                                                            mb: 2,
                                                            "&:hover .camera-icon": {
                                                                opacity: 1,
                                                            },
                                                        }}
                                                    >
                                                        <label htmlFor="profile-image-upload">
                                                            <input
                                                                id="profile-image-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: "none" }}
                                                                onChange={handleImageUpload}
                                                            />
                                                            <IconButton
                                                                component="span"
                                                                disabled={loading}
                                                                sx={{
                                                                    position: "absolute",
                                                                    backgroundColor: appTheme.palette.primary.main,
                                                                    color: "white",
                                                                    opacity: 0,
                                                                    zIndex: 1,
                                                                    transition: "opacity 0.3s",
                                                                    "&:hover": {
                                                                        backgroundColor: appTheme.palette.primary.dark,
                                                                    },
                                                                }}
                                                                className="camera-icon"
                                                            >
                                                                <CameraAltIcon />
                                                            </IconButton>
                                                        </label>
                                                        <Avatar
                                                            alt="Profile"
                                                            src={
                                                                user.image
                                                                    ? `http://localhost:8080/users/uploads/${user.image}`
                                                                    : "/default-avatar.jpg"
                                                            }
                                                            sx={{
                                                                width: 130,
                                                                height: 130,
                                                                zIndex: 0,
                                                            }}
                                                        />
                                                    </Box>
                                                </Zoom>

                                                <Typography variant="h5" gutterBottom>
                                                    {user.username}
                                                </Typography>
                                                <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
                                                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="subtitle1">
                                                        {user.email}
                                                    </Typography>
                                                </Box>

                                                {/* Followers/Following */}
                                                <Box display="flex" justifyContent="space-between" width="100%" gap={2} mb={3}>
                                                    <Card
                                                        sx={{
                                                            flex: 1,
                                                            textAlign: "center",
                                                            backgroundColor: appTheme.palette.background.default,
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                                {followersCount}
                                                            </Typography>
                                                            <Typography variant="body2">Followers</Typography>
                                                        </CardContent>
                                                    </Card>
                                                    <Card
                                                        sx={{
                                                            flex: 1,
                                                            textAlign: "center",
                                                            backgroundColor: appTheme.palette.background.default,
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                                {followingCount}
                                                            </Typography>
                                                            <Typography variant="body2">Following</Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Box>

                                                {/* Action Buttons */}
                                                <Box width="100%" mb={3}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => setOpenEditDialog(true)}
                                                        fullWidth
                                                        sx={{ mb: 2 }}
                                                        disabled={loading}
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                </Box>

                                                {/* Post Upload */}
                                                <Box width="100%" mb={2}>
                                                    {/* Description Input */}
                                                    <TextField
                                                        label="Description (optional)"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={postDescription}
                                                        onChange={(e) => setPostDescription(e.target.value)}
                                                        disabled={loading}
                                                        inputProps={{ maxLength: 255 }}
                                                        helperText={`${postDescription.length}/255`}
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <label htmlFor="post-upload">
                                                        <input
                                                            id="post-upload"
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            multiple
                                                            style={{ display: "none" }}
                                                            onChange={handlePostUpload}
                                                        />
                                                        <Button
                                                            component="span"
                                                            variant="contained"
                                                            color="secondary"
                                                            fullWidth
                                                            startIcon={<AddIcon />}
                                                            disabled={loading}
                                                        >
                                                            Upload Post
                                                        </Button>
                                                    </label>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} md={7} lg={6}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                height: "100%",
                                                background: appTheme.palette.background.paper,
                                            }}
                                        >
                                            {/* About Section */}
                                            <Box sx={{width: "100%"}}>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    onClick={() => setShowAbout(!showAbout)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        mb: 1,
                                                        "&:hover": {
                                                            backgroundColor: appTheme.palette.action.hover,
                                                            borderRadius: 1,
                                                        },
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{p: 1}}>
                                                        About Me
                                                    </Typography>
                                                    <IconButton>
                                                        <ExpandMoreIcon
                                                            sx={{
                                                                transform: showAbout
                                                                    ? "rotate(180deg)"
                                                                    : "rotate(0)",
                                                                transition: "transform 0.3s",
                                                                color: appTheme.palette.primary.main,
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                <Collapse in={showAbout}>
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        gap={2}
                                                        mt={1}
                                                        p={2}
                                                        sx={{
                                                            backgroundColor:
                                                            appTheme.palette.background.default,
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="center">
                                                            <PersonIcon color="primary" sx={{mr: 2}}/>
                                                            <Typography variant="body1">
                                                                <strong>Username:</strong> {user.username}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <EmailIcon color="primary" sx={{mr: 2}}/>
                                                            <Typography variant="body1">
                                                                <strong>Email:</strong> {user.email}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <PhoneIcon color="primary" sx={{mr: 2}}/>
                                                            <Typography variant="body1">
                                                                <strong>Mobile:</strong>{" "}
                                                                {user.mobile || "Not provided"}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <CakeIcon color="primary" sx={{mr: 2}}/>
                                                            <Typography variant="body1">
                                                                <strong>Date of Birth:</strong>{" "}
                                                                {formatDate(user.dateOfBirth)}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="flex-start">
                                                            <DescriptionIcon
                                                                color="primary"
                                                                sx={{mr: 2, mt: 0.5}}
                                                            />
                                                            <Typography variant="body1">
                                                                <strong>Description:</strong>{" "}
                                                                {user.description || "No description available"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            </Box>

                                            {/* Additional Info */}
                                            <Box mt={4}>
                                                <Typography variant="h6" gutterBottom>
                                                    Account Details
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 1,
                                                        mb: 3,
                                                    }}
                                                >
                                                    <Chip
                                                        label={`Joined: ${formatDate(user.createdAt)}`}
                                                        color="primary"
                                                        variant="outlined"
                                                        icon={<CheckIcon/>}
                                                    />
                                                    <Chip
                                                        label={
                                                            user.lastLogin
                                                                ? `Last login: ${formatDate(user.lastLogin)}`
                                                                : "Never logged in"
                                                        }
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Danger Zone */}
                                            <Box mt={4}>
                                                <Typography variant="h6" gutterBottom color="error">
                                                    Danger Zone
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<DeleteIcon/>}
                                                    onClick={handleDelete}
                                                    fullWidth
                                                    disabled={loading}
                                                    sx={{
                                                        "&:hover": {
                                                            backgroundColor: appTheme.palette.error.dark,
                                                        },
                                                    }}
                                                >
                                                    Delete Account
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grow>
                        )}

                        {/* Section for Managing User Posts */}
                        {user && !loading && (
                            <Grow in={true} timeout={1000}>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={5} lg={4} mt={4}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                background: appTheme.palette.background.paper,
                                                width: "100%",
                                                mx: "auto",
                                            }}
                                        >
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="h6" gutterBottom>
                                                    My Posts
                                                </Typography>
                                                <Box sx={{ width: "100%" }}>
                                                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                                        <Tabs
                                                            value={tabValue}
                                                            onChange={handleTabChange}
                                                            aria-label="Posts tabs"
                                                            variant="fullWidth"
                                                        >
                                                            <Tab label="Image Posts" {...a11yProps(0)} />
                                                            <Tab label="Video Posts" {...a11yProps(1)} />
                                                        </Tabs>
                                                    </Box>
                                                    <CustomTabPanel value={tabValue} index={0}>
                                                        <Grid container spacing={4}>
                                                            {imagePosts && imagePosts.length > 0 ? (
                                                                imagePosts.map((post) => {
                                                                    const imageFiles = post.mediaFiles
                                                                        ? post.mediaFiles.filter((file) => isImageFile(file))
                                                                        : [];
                                                                    return (
                                                                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                                                                            <Card
                                                                                sx={{
                                                                                    borderRadius: 3,
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    height: "100%",
                                                                                    backgroundColor: (theme) =>
                                                                                        theme.palette.mode === "dark"
                                                                                            ? theme.palette.grey[800]
                                                                                            : theme.palette.grey[100],
                                                                                }}
                                                                            >
                                                                                {imageFiles.length > 0 && (
                                                                                    <>
                                                                                        {imageFiles.length > 1 ? (
                                                                                            <Carousel
                                                                                                key={post.id}
                                                                                                navButtonsAlwaysVisible
                                                                                                indicators
                                                                                                autoPlay={false}
                                                                                                animation="slide"
                                                                                                swipe={true}
                                                                                                cycleNavigation={true}
                                                                                                onChange={(index) => console.log("Current slide:", index)}
                                                                                            >
                                                                                                {imageFiles.map((file, index) => (
                                                                                                    <div
                                                                                                        key={`${post.id}-${index}`}
                                                                                                        style={{
                                                                                                            width: "100%",
                                                                                                            height: "200px",
                                                                                                            display: "flex",
                                                                                                            alignItems: "center",
                                                                                                            justifyContent: "center",
                                                                                                        }}
                                                                                                    >
                                                                                                        <img
                                                                                                            src={getPostImageUrl(file, post.id, index)}
                                                                                                            alt={`Media ${index + 1}`}
                                                                                                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                                                                                        />
                                                                                                    </div>
                                                                                                ))}
                                                                                            </Carousel>
                                                                                        ) : (
                                                                                            <Box
                                                                                                sx={{
                                                                                                    width: "100%",
                                                                                                    height: "200px",
                                                                                                    overflow: "hidden",
                                                                                                }}
                                                                                            >
                                                                                                <Box
                                                                                                    component="img"
                                                                                                    src={getPostImageUrl(imageFiles[0])}
                                                                                                    alt="Media"
                                                                                                    sx={{
                                                                                                        width: "100%",
                                                                                                        height: "100%",
                                                                                                        objectFit: "cover",
                                                                                                    }}
                                                                                                />
                                                                                            </Box>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                                <CardContent sx={{ flexGrow: 1 }}>
                                                                                    <Typography variant="body1" gutterBottom>
                                                                                        {post.description}
                                                                                    </Typography>
                                                                                </CardContent>
                                                                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                                                                    <Button
                                                                                        size="small"
                                                                                        color="primary"
                                                                                        onClick={() => handleEditPost(post)}
                                                                                        startIcon={<EditIcon />}
                                                                                    >
                                                                                        Edit
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="small"
                                                                                        color="error"
                                                                                        onClick={() => handleDeletePost(post.id)}
                                                                                        startIcon={<DeleteIcon />}
                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                </CardActions>
                                                                            </Card>
                                                                        </Grid>
                                                                    );
                                                                })
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="textSecondary"
                                                                    sx={{ width: "100%", textAlign: "center" }}
                                                                    mt={4}
                                                                >
                                                                    No image posts available.
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                    </CustomTabPanel>
                                                    <CustomTabPanel value={tabValue} index={1}>
                                                        <Grid container spacing={4}>
                                                            {videoPosts && videoPosts.length > 0 ? (
                                                                videoPosts.map((post) => (
                                                                    <Grid item xs={6} sm={4} md={3} key={post.id}>
                                                                        <Card
                                                                            sx={{
                                                                                borderRadius: 3,
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                maxWidth: 320,
                                                                                height: "auto",
                                                                                backgroundColor: (theme) =>
                                                                                    theme.palette.mode === "dark"
                                                                                        ? theme.palette.grey[800]
                                                                                        : theme.palette.grey[100],
                                                                            }}
                                                                        >
                                                                            {post.mediaFiles?.length > 0 && (
                                                                                (() => {
                                                                                    const videoFiles = post.mediaFiles.filter(isVideoFile);
                                                                                    /* show a Carousel only when there is more than one video */
                                                                                    if (videoFiles.length > 1) {
                                                                                        return (
                                                                                            <Carousel
                                                                                                navButtonsAlwaysVisible={false}
                                                                                                autoPlay={false}
                                                                                                indicators={true}
                                                                                                sx={{
                                                                                                    height: 200,
                                                                                                    borderRadius: 2,
                                                                                                    "& .MuiPaper-root": { boxShadow: "none", borderRadius: 2 }, // remove extra paper
                                                                                                }}
                                                                                            >
                                                                                                {videoFiles.map((file, idx) => (
                                                                                                    <video
                                                                                                        key={idx}
                                                                                                        controls
                                                                                                        preload="metadata"
                                                                                                        crossOrigin="use-credentials"
                                                                                                        style={{
                                                                                                            width: "100%",
                                                                                                            height: "100%",
                                                                                                            objectFit: "cover",
                                                                                                            borderRadius: 8,
                                                                                                        }}
                                                                                                    >
                                                                                                        <source
                                                                                                            src={getPostMediaUrl(file, `${post.id}-${idx}`)}
                                                                                                            type="video/mp4"
                                                                                                        />
                                                                                                        Your browser does not support the video tag.
                                                                                                    </video>
                                                                                                ))}
                                                                                            </Carousel>
                                                                                        );
                                                                                    }

                                                                                    /* single video → keep it simple */
                                                                                    return (
                                                                                        <Box
                                                                                            height={200}
                                                                                            overflow="hidden"
                                                                                            borderRadius={2}
                                                                                        >
                                                                                            <video
                                                                                                controls
                                                                                                preload="metadata"
                                                                                                crossOrigin="use-credentials"
                                                                                                style={{
                                                                                                    width: "100%",
                                                                                                    height: "100%",
                                                                                                    objectFit: "cover",
                                                                                                    borderRadius: 8,
                                                                                                }}
                                                                                            >
                                                                                                <source
                                                                                                    src={getPostMediaUrl(videoFiles[0], `${post.id}-0`)}
                                                                                                    type="video/mp4"
                                                                                                />
                                                                                                Your browser does not support the video tag.
                                                                                            </video>
                                                                                        </Box>
                                                                                    );
                                                                                })()
                                                                            )}
                                                                            <CardContent sx={{ flexGrow: 1 }}>
                                                                                <Typography variant="body1" gutterBottom>
                                                                                    {post.description}
                                                                                </Typography>
                                                                            </CardContent>
                                                                            <CardActions sx={{ justifyContent: "flex-end" }}>
                                                                                <Button
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    onClick={() => handleEditPost(post)}
                                                                                    startIcon={<EditIcon />}
                                                                                >
                                                                                    Edit
                                                                                </Button>
                                                                                <Button
                                                                                    size="small"
                                                                                    color="error"
                                                                                    onClick={() => handleDeletePost(post.id)}
                                                                                    startIcon={<DeleteIcon />}
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </CardActions>
                                                                        </Card>
                                                                    </Grid>
                                                                ))
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="textSecondary"
                                                                    sx={{ width: "100%", textAlign: "center" }}
                                                                    mt={4}
                                                                >
                                                                    No video posts available.
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                    </CustomTabPanel>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grow>
                        )}
                    </Container>
                </Box>

                {/* Edit Profile Dialog */}
                <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    TransitionComponent={Slide}
                    transitionDuration={500}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: appTheme.palette.primary.main,
                            color: "white",
                        }}
                    >
                        Edit Profile
                    </DialogTitle>
                    <DialogContent sx={{pt: 3}}>
                        <Box sx={{mt: 2}}>
                            <TextField
                                label="Username"
                                fullWidth
                                value={updatedUser.username || ""}
                                name="username"
                                onChange={handleChange}
                                sx={{mb: 2}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <PersonIcon
                                            color="primary"
                                            sx={{mr: 1, color: "action.active"}}
                                        />
                                    ),
                                }}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={updatedUser.email || ""}
                                name="email"
                                onChange={handleChange}
                                sx={{mb: 2}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <EmailIcon
                                            color="primary"
                                            sx={{mr: 1, color: "action.active"}}
                                        />
                                    ),
                                }}
                            />
                            <TextField
                                label="Mobile"
                                fullWidth
                                value={updatedUser.mobile || ""}
                                name="mobile"
                                onChange={handleChange}
                                sx={{mb: 2}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <PhoneIcon
                                            color="primary"
                                            sx={{mr: 1, color: "action.active"}}
                                        />
                                    ),
                                }}
                            />
                            <TextField
                                label="Date of Birth"
                                fullWidth
                                type="date"
                                value={
                                    updatedUser.dateOfBirth
                                        ? new Date(updatedUser.dateOfBirth).toISOString().split("T")[0]
                                        : ""
                                }
                                name="dateOfBirth"
                                onChange={handleChange}
                                sx={{mb: 2}}
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <CakeIcon
                                            color="primary"
                                            sx={{mr: 1, color: "action.active"}}
                                        />
                                    ),
                                }}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={updatedUser.description || ""}
                                name="description"
                                onChange={handleChange}
                                sx={{mb: 2}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <DescriptionIcon
                                            color="primary"
                                            sx={{mr: 1, mt: 0.5, color: "action.active"}}
                                        />
                                    ),
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                    gap: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<CameraAltIcon/>}
                                >
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => setSelectedImage(e.target.files[0])}
                                    />
                                </Button>
                                {selectedImage && (
                                    <Typography variant="body2">{selectedImage.name}</Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{p: 2}}>
                        <Button
                            onClick={() => setOpenEditDialog(false)}
                            disabled={loading}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            endIcon={
                                loading ? (
                                    <CircularProgress size={24} color="inherit"/>
                                ) : (
                                    <CheckIcon/>
                                )
                            }
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* --- Edit Post Dialog --- */}
                <Dialog
                    open={openEditPostDialog}
                    onClose={() => setOpenEditPostDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    TransitionComponent={Slide}
                    transitionDuration={500}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: appTheme.palette.primary.main,
                            color: "white",
                        }}
                    >
                        Edit Post
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={editPostDescription}
                                onChange={(e) => setEditPostDescription(e.target.value)}
                                sx={{ mb: 2 }}
                                variant="outlined"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<CameraAltIcon />}
                                >
                                    Upload Media
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        hidden
                                        multiple
                                        onChange={handleEditPostFileChange}
                                    />
                                </Button>
                                {editPostFiles.length > 0 && (
                                    <Typography variant="body2">
                                        {editPostFiles.map((f) => f.name).join(", ")}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setOpenEditPostDialog(false)}
                            disabled={loading}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditPostSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            endIcon={
                                loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <CheckIcon />
                                )
                            }
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                    TransitionComponent={Slide}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{width: "100%"}}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default UserProfile;
