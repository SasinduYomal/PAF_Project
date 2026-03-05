// src/components/LearningProgress.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

const templateOptions = [
    { label: "Completed Tutorial", value: "tutorial" },
    { label: "Acquired New Skill", value: "newSkill" },
    { label: "Project Progress", value: "project" },
];

function LearningProgress() {
    const [template, setTemplate] = useState("");
    const [progressDetail, setProgressDetail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // API submission logic goes here
        console.log("Learning Progress Update:", { template, progressDetail });
        // Reset form values
        setTemplate("");
        setProgressDetail("");
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Learning Progress Update
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label="Select Template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {templateOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Progress Details"
                    placeholder="Share your progress..."
                    fullWidth
                    multiline
                    rows={4}
                    value={progressDetail}
                    onChange={(e) => setProgressDetail(e.target.value)}
                />

                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Submit Update
                </Button>
            </form>
        </Box>
    );
}

export default LearningProgress;
