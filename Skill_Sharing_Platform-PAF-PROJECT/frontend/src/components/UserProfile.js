// src/components/UserProfile.js
import React from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";

// Sample user data; in a real app, you would fetch this from your API.
const sampleUser = {
    id: 1,
    name: "John Doe",
    picture: "https://via.placeholder.com/150",
    followers: 300,
    following: 120,
    posts: [
        {
            id: 1,
            title: "Skill Sharing: Photography",
            content: "I love capturing moments with my camera.",
            imageUrl: "https://via.placeholder.com/300",
        },
        {
            id: 2,
            title: "Learning Progress: Javascript",
            content: "Completed a React course!",
            imageUrl: "https://via.placeholder.com/300",
        },
    ],
};

function UserProfile() {
    const user = sampleUser;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                    src={user.picture}
                    sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                    <Typography variant="h5">{user.name}</Typography>
                    <Typography variant="body2">
                        {user.followers} Followers • {user.following} Following
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 1 }}>
                        Follow
                    </Button>
                </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
                Posts
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {user.posts.map((post) => (
                    <Card key={post.id} sx={{ width: 300 }}>
                        {post.imageUrl && (
                            <CardMedia
                                component="img"
                                height="140"
                                image={post.imageUrl}
                                alt={post.title}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h6">{post.title}</Typography>
                            <Typography variant="body2">{post.content}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default UserProfile;
