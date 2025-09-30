import React from 'react';
import RequestSongForm from '../components/contact/RequestSongForm';
import { Helmet } from 'react-helmet-async';

const RequestSongPage = () => {
  return (
    <div className="bg-dark text-white min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Request a Song | Suvojeet Sengupta</title>
        <meta name="description" content="Request a song for Suvojeet Sengupta to cover. Share your favorite songs and get a chance to hear his version." />
      </Helmet>
      <RequestSongForm />
    </div>
  );
};

export default RequestSongPage;
