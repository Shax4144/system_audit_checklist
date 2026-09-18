import React from 'react';

const ExternalRedirect = ({ url }) => {
  React.useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null; // or a loading spinner while redirecting
};

export default ExternalRedirect;