// import React from 'react';

// export default function Dashboard({ user }) {
//   return <div>Welcome, {user?.name || user?.email}</div>;
// }
//


import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Divider, 
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Person, History, Settings } from '@mui/icons-material';

export default function Dashboard({ user }) {
  return (
    <Box sx={{ 
      p: 4,
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        mb: 4,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              bgcolor: 'white',
              color: '#1976d2',
              fontSize: '2.5rem'
            }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Welcome back, {user?.name || user?.email?.split('@')[0]}
            </Typography>
            <Typography variant="subtitle1">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Typography variant="body1">
          Last login: {new Date().toLocaleDateString()}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 3
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Profile Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your personal information and preferences
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                startIcon={<Settings />}
              >
                Manage Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 3
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <History sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Scraping History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your previous scraping jobs and results
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                startIcon={<History />}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 3
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Settings sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start a new scraping job or configure settings
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                New Scraping Job
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}