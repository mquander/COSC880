import React from "react";
import '../App.css';
import ema from "../images/ema.png";
import LR from "../images/LR.png";
import scaled from "../images/scaled.png";
import corrCoef from "../images/corrCoef.png";
import lstm from "../images/lstm.png";
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
          <Box sx={{ minWidth: 1000}}>
          <Typography variant="h6" align="center" color="white" component="p">
            <p>
            As part of COSC 880 completion at Towson University, this project offers an open source tool to investigate the correlation between
            a cryptocurrency and economic industry, specified by the user. As a web-based application, it makes calls to multiple RESTful APIs to 
            obtain the cryptocurrency and sector index pricing data for a given time frame. It then calculates the correlation coefficient between the two, and
            displays the time-series pricing data on a dynamic graph.</p>
          <p>
            Once the data is rendered, the user has the option to display the Exponential Moving Average, Normalized data, Linear Regression line, 
            and the Long Short Term Memory prediction. Below is a brief description of the formulas and algorithms used.
            </p>
          </Typography>
          </Box>
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
            <i>Statistical measure of the strength of the relationship between the relative movements of two variables</i>
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
          <i>A type of moving average (MA) that places a greater weight and significance on the most recent data points</i>
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
            <i>Each value is normalized to the start value, subsequent values are calculated so that percent changes in the indexed series are the same as in the nonindexed.</i>
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
          src={lstm}
          />
          LSTM
          <Typography variant="h6" align="center" color="white" component="p" sx={{mb: 6}}>
          <i>A special kind of RNN, capable of learning long-term dependencies, designed to avoid the long-term dependency problem.</i>
          </Typography>
          {/* https://colah.github.io/posts/2015-08-Understanding-LSTMs/ */}

          <Box sx={{ minWidth: 1000}}>
          <Typography variant="h6" align="center" color="white" component="p">
          <p style={{color:"red", display:"inline-block"}}> Disclaimer:</p> This application is for demonstration only and is not intended for financial advice, as cryptocurrency and financial markets are affected
            by many variables that are not captured here.
          </Typography>
          </Box>
          </Box>
        </Container>
    </ThemeProvider>
    
  );
};

export default About;
