export const getAuthToken = () => {
    // Store the token in a variable
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Return the token value
    return token;
  };
  