import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  CircularProgress, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  Alert,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { Link as LinkIcon, Refresh } from '@mui/icons-material';

const Scraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:8000/api/scrape-jobs/', 
        { url },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const dataResponse = await axios.get('http://localhost:8000/api/scraped-data/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setScrapedData(dataResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scrape website');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!url) return;
    await handleSubmit({ preventDefault: () => {} });
  };

  return (
    <Box sx={{ 
      padding: 4,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 3
        }}>
          Website Scraper
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            mb: 2
          }}>
            <TextField
              fullWidth
              label="Enter website URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              InputProps={{
                sx: {
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }
              }}
              required
            />
            <IconButton 
              onClick={handleRefresh}
              color="primary"
              sx={{ 
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={isLoading}
            sx={{ 
              mt: 1,
              px: 4,
              py: 1.5,
              borderRadius: 1,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Scraping...
              </>
            ) : 'Scrape Website'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          Scraped Results
          {scrapedData.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({scrapedData.length} items found)
            </Typography>
          )}
        </Typography>

        {scrapedData.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3
          }}>
            {scrapedData.map((item) => (
              <Card key={item.id} sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LinkIcon />
                    </Avatar>
                  }
                  title={
                    <Typography 
                      variant="subtitle1" 
                      component="a" 
                      href={item.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {item.title || 'Untitled'}
                    </Typography>
                  }
                  subheader={new Date(item.created_at).toLocaleString()}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.content || 'No content available'}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Paper elevation={0} sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'action.hover',
            borderRadius: 2
          }}>
            <Typography variant="body1" color="text.secondary">
              {isLoading ? 'Fetching data...' : 'No scraped data yet. Enter a URL to begin scraping.'}
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Scraper;