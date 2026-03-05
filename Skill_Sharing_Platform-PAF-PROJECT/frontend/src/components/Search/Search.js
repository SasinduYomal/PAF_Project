import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import MainContent from './components/MainContent';
import Sidebar from "../navigation pane/Sidebar";
import { Box } from "@mui/material";

export default function Search(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline/>
            <Box display="flex" minHeight="100vh">
                <Sidebar/>
                <AppAppBar/>
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{display: 'flex', flexDirection: 'column', my: 5, gap: 4}}
                >
                    <MainContent/>
                </Container>
            </Box>
        </AppTheme>
    );
}

