// src/components/SkillSharingPosts.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
} from "@mui/material";

function SkillSharingPosts() {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState("");

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 3); // Limit to 3
        setFiles(selectedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace this with proper API integration and file upload handling
        console.log("Post submitted:", { files, description });
        // Reset the form
        setFiles([]);
        setDescription("");
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Share Your Skills
            </Typography>
            <form onSubmit={handleSubmit}>
                <Button variant="outlined" component="label">
                    Upload Photos / Videos (max 3)
                    <input
                        type="file"
                        accept="image/*,video/mp4"
                        multiple
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>

                <Box sx={{ mt: 2 }}>
                    {files.map((file, index) => (
                        <Typography key={index} variant="body2">
                            {file.name}
                        </Typography>
                    ))}
                </Box>

                <TextField
                    label="Description"
                    placeholder="Describe your skill..."
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Submit Post
                </Button>
            </form>
        </Box>
    );
}

export default SkillSharingPosts;
