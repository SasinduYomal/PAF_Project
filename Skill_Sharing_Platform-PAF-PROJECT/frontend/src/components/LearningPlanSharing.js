// src/components/LearningPlanSharing.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";

function LearningPlanSharing() {
    const [planTitle, setPlanTitle] = useState("");
    const [topics, setTopics] = useState("");
    const [resources, setResources] = useState("");
    const [timeline, setTimeline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace with your API post logic
        console.log("Learning Plan Shared:", { planTitle, topics, resources, timeline });
        // Reset the form
        setPlanTitle("");
        setTopics("");
        setResources("");
        setTimeline("");
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Share Your Learning Plan
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Plan Title"
                    fullWidth
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Topics"
                    placeholder="List the topics (comma separated)"
                    fullWidth
                    multiline
                    rows={2}
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Resources"
                    placeholder="Provide links or descriptions of resources"
                    fullWidth
                    multiline
                    rows={2}
                    value={resources}
                    onChange={(e) => setResources(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Completion Timeline"
                    placeholder="e.g., 3 months, or a specific date range"
                    fullWidth
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button variant="contained" type="submit">
                    Share Plan
                </Button>
            </form>
        </Box>
    );
}

export default LearningPlanSharing;
