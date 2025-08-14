import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledNavbar = styled('nav')({
  backgroundColor: '#2c3e50',
  padding: '0 30px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  height: '64px',
});

const NavLink = styled(Link)({
  color: '#ecf0f1',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '500',
  padding: '20px 15px',
  margin: '0 5px',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#34495e',
    color: '#f1c40f',
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '3px',
    backgroundColor: '#f1c40f',
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  },
});

const Logo = styled('div')({
  color: '#f1c40f',
  fontSize: '22px',
  fontWeight: 'bold',
  marginRight: 'auto',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  letterSpacing: '1px',
});

export default function Navbar() {
  return (
    <StyledNavbar>
      <Logo>WebScraper</Logo>
      <NavLink to="/">Login</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/scraper">Scraper</NavLink>
    </StyledNavbar>
  );
}

// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Navbar() {
//   return (
//     <nav style={{padding: '10px 20px', borderBottom: '1px solid #ddd', display: 'flex', gap: '12px'}}>
//       <Link to="/">Login</Link>
//       <Link to="/dashboard">Dashboard</Link>
//       <Link to="/scraper">Scraper</Link>
//     </nav>
//   );
// }
