import React from "react";
import '../App.css';
import ema from "../images/ema.png";
import LR from "../images/LR.png";
import scaled from "../images/scaled.png";
import corrCoef from "../images/corrCoef.png";
import lstm from "../images/lstm.png";
import locf from "../images/locf.png";
import Link from '@mui/material/Link';
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
            <Typography variant="h6" align="center" color="white"  component="span">
              <p>
              
              
              
              
              
              
              
              As part of COSC 880 completion at Towson University, this project offers an open source tool to investigate the correlation between
              a cryptocurrency and economic industry. These include <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/QQQ/" target="_blank">technology stocks</Link>, 
              <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/XLF/" target="_blank"> financial stocks</Link>, <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/VCR/" target="_blank"> consumer cyclicals</Link>, 
              <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/XLV/" target="_blank"> healthcare stocks</Link> , <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/IYT/" target="_blank"> transportation stocks</Link>, 
              the <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/VIXY/" target="_blank"> volatility index</Link>, <Link rel="noopener noreferrer" href="https://finance.yahoo.com/quote/TLT/" target="_blank"> US Treasuries</Link>, 
              and the OPEC <Link rel="noopener noreferrer" href="https://data.nasdaq.com/api/v3/datasets/OPEC/ORB" target="_blank">oil price</Link>.
              It makes calls to multiple APIs to 
              obtain the cryptocurrency and sector index pricing data, and calculates the correlation coefficient between the two.</p>
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
          <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
            <i>Statistical measure of the strength of the relationship between the relative movements of two variables; values less than +0.8 or greater than -0.8 are not considered significant.</i>
            </Typography>
            {/* https://www.investopedia.com/terms/c/correlationcoefficient.asp */}
            
            <Box 
              component="img"
              sx={{
                  // height: "auto",
                  // width: "auto", mb: 6,
                  display: 'flex', margin:4, 
                  maxHeight: { xs: 400, md: 280 },
                  maxWidth: { xs: 500, md: 600 }, 
              }}
              alt=""
              src={locf}
              />
            Last Observation Carried Forward
            <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
              <i>A method of imputing missing data in longitudinal studies.</i>
              </Typography>
          
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
          Exponential Moving Average
          <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
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
          Normalization
          <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
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
          <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
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
          Long Short Term Memory
          <Typography variant="h6" align="center" color="white" component="span" sx={{mb: 6}}>
          <i>A special kind of RNN, capable of learning long-term dependencies, designed to avoid the long-term dependency problem.</i>
          </Typography>
          {/* https://colah.github.io/posts/2015-08-Understanding-LSTMs/ */}

          <Box sx={{ minWidth: 1000}}>
          <Typography variant="h6" align="center" color="white" component="span">
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
