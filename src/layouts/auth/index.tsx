import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from '../../components/Logo';
import { NavLink, useNavigate } from 'react-router-dom';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      {/* <Link color="inherit" href="#/">
        Everest
      </Link> */}{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Auth() {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    return navigate('/manager/home');
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              color={'red'}
              fontSize={'25px'}
              style={{
                fontWeight: 'bold',
              }}
            >
              "Welcome to Scheduling App"
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <NavLink to={'/manager/home'}>
                <Button
                  type='submit'
                  fullWidth
                  color='warning'
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In as Manager
                </Button>
              </NavLink>
              <NavLink to={'/physician/home'}>
                <Button
                  type='submit'
                  fullWidth
                  color='primary'
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In as Physician
                </Button>
              </NavLink>
              <NavLink to={'/patient/home'}>
                <Button
                  type='submit'
                  fullWidth
                  color='info'
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In as Patient
                </Button>
              </NavLink>

              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
