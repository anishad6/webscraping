// import { useState } from 'react';  // Add this import
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Box, CircularProgress, Typography, Alert } from '@mui/material';

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

// //   const handleSuccess = async (credentialResponse) => {
// //   setLoading(true);
// //   setError(null);

// //   try {
// //     // ✅ Send token key exactly as backend expects
// //     const response = await axios.post(
// //       "http://localhost:8000/api/auth/google/",
// //       { access_token: credentialResponse.credential }, // backend expects this key
// //       {
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         },
// //         withCredentials: true
// //       }
// //     );

// //     // ✅ Store token from backend
// //     localStorage.setItem('access_token', response.data.token);
// //     navigate('/dashboard');
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     setError(error.response?.data?.error || 'Login failed');
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// const handleSuccess = async (credentialResponse) => {
//   setLoading(true);
//   setError(null);

//   try {
//     const response = await axios.post(
//       "http://localhost:8000/api/auth/google/",
//       { access_token: credentialResponse.credential },
//       {
//         headers: { 
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         withCredentials: true // ✅ must match CORS_ALLOW_CREDENTIALS=True
//       }
//     );

//     localStorage.setItem("access_token", response.data.token);
//     navigate("/dashboard");
//   } catch (error) {
//     console.error("Login error:", error);
//     setError(error.response?.data?.error || "Login failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleError = () => {
//     setError('Google login failed. Please try again.');
//   };

//   return (
//     <Box sx={{ 
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       flexDirection: 'column',
//       gap: 2
//     }}>
//       <Typography variant="h4" gutterBottom>
//         Welcome to Scraper App
//       </Typography>
      
//       <GoogleOAuthProvider
//         clientId="126474618620-l23p7893eu8uprgcfcuon1fsqvl1087g.apps.googleusercontent.com"
//       >
//         {loading ? (
//           <CircularProgress size={60} />
//         ) : (
//           <GoogleLogin
//             onSuccess={handleSuccess}
//             onError={handleError}
//             shape="pill"
//             size="large"
//             text="continue_with"
//             theme="filled_blue"
//           />
//         )}
//       </GoogleOAuthProvider>
      
//       {error && (
//         <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
//           {error}
//         </Alert>
//       )}
      
//       <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//         By continuing, you agree to our Terms of Service and Privacy Policy
//       </Typography>
//     </Box>
//   );
// };
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Paper  // Added Paper import here
} from '@mui/material';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Received credential:', credentialResponse.credential);
      
      const response = await axios.post('http://localhost:8000/api/auth/google/', 
        { credential: credentialResponse.credential },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log('Auth success:', response.data);
      
      // Store token and navigate
      localStorage.setItem('authToken', response.data.token);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Full error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = 'Invalid credentials. Please try again.';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google login failed. Please try again or use another method.');
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default',
      p: 3
    }}>
      <GoogleOAuthProvider clientId="126474618620-l23p7893eu8uprgcfcuon1fsqvl1087g.apps.googleusercontent.com">
        <Paper elevation={3} sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Welcome Back
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ position: 'relative' }}>
            {loading && (
              <CircularProgress 
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              shape="pill"
              size="large"
              text="continue_with"
              theme="filled_blue"
              disabled={loading}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </GoogleOAuthProvider>
    </Box>
  );
};

export default Login;