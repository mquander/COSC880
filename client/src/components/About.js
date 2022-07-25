import React from "react";
//import CustomAppBar from "./CustomAppBar";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function About() {
  return (
    
    <ThemeProvider theme={theme}>
      <Container  maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
    <CssBaseline />
    <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mb: 6  , display: 'flex'}}>
          <Typography
            component="h1"
            variant="h5"
            align="center"
            color="white"
            
          >
            About the Crypto-Index App
          </Typography>
          </Box>
          <Typography variant="h6" align="center" color="white" component="p">
            COSC 880, add info about this app, project, crypto, index ETFs, technical analysis, algorithms used, etc..
          </Typography>
          <Box 
          component="img"
          sx={{
              height: 120,
              width: 200,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
          }}
          alt=""
          src=""
          /* placeholder to insert image later */
          />
          
          
          </Box>
        </Container>
    </ThemeProvider>
    
  );
};

export default About;
