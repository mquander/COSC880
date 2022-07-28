import React from "react";
import '../App.css';
import ema from "../images/ema.png";
import LR from "../images/LR.png";
import scaled from "../images/scaled.png";
import corrCoef from "../images/corrCoef.png";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
/*
          Scaled credit: https://www.dallasfed.org/research/basics/indexing.aspx
          EMA credit: https://www.investopedia.com/terms/e/ema.asp
          LR credit: https://medium.com/nerd-for-tech/simple-linear-regression-modeling-part-1-1ae3b59c6ab5
           */
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
          <Box sx={{ mb: 5  , display: 'flex'}}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="white"
            
          >
            About the Crypto-Index App
          </Typography>

          
          </Box>
          <Typography variant="h6" align="center" color="white" component="p" sx={{margin:4}}>
            COSC 880, add info about this app, project, crypto, index ETFs, technical analysis, algorithms used, etc..
          </Typography>
          
          <Box 
          component="img"
          sx={{
              // height: "auto",
              // width: "auto", mb: 6,
              display: 'flex', margin:4, 
              maxHeight: { xs: 600, md: 400 },
              maxWidth: { xs: 500, md: 600 }, 
          }}
          alt=""
          src={corrCoef}
          />
          Correlation Coefficient
          <Typography variant="h6" align="center" color="white" component="p" sx={{mb: 6}}>
            <i>statistical measure of the strength of the relationship between the relative movements of two variables</i>
            </Typography>
            {/* https://www.investopedia.com/terms/c/correlationcoefficient.asp */}
          <Box 
          component="img"
          sx={{
              // height: "auto",
              // width: "auto", 
              display: 'flex', margin:4,
              maxHeight: { xs: 600, md: 400 },
              maxWidth: { xs: 500, md: 600 }, 
          }}
          alt=""
          src={ema}
          />
          Exponential Moving Averge
          <Typography variant="h6" align="center" color="white" component="p" sx={{mb: 6}}>
          <i>a type of moving average (MA) that places a greater weight and significance on the most recent data points</i>
          </Typography>
          {/* https://www.investopedia.com/terms/e/ema.asp */}
          <Box 
          component="img"
          sx={{
              height: 180,
              width: 430,
              display: 'flex', margin:4
              // maxHeight: { xs: 300, md: 200 },
              // maxWidth: { xs: 450, md: 350 },
          }}
          alt=""
          src={scaled}
          />
          Normalized
          <Typography variant="h6" align="center" color="white" component="p" sx={{mb: 6}}>
            <i>every value is normalized to the start value, maintaining the same percentage changes as in the nonindexed series. Subsequent values are calculated so that percent changes in the indexed series are the same as in the nonindexed.</i>
          </Typography>
          {/* https://www.dallasfed.org/research/basics/indexing.aspx */}
          <Box 
          component="img"
          sx={{
              // height: "auto",
              // width: "auto", 
              display: 'flex', margin:4,
              maxHeight: { xs: 600, md: 500 },
              maxWidth: { xs: 600, md: 500 },
          }}
          alt=""
          src={LR}
          />
          Linear Regression
          <Typography variant="h6" align="center" color="white" component="p" sx={{mb: 6}}>
          <i>Linear regression establishes the linear relationship between two variables based on a line of best fit.</i>
        </Typography>
        {/* https://www.investopedia.com/terms/r/regression.asp */}
          </Box>
        </Container>
    </ThemeProvider>
    
  );
};

export default About;
