import React from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiBaseUrl);
const getApi = () => {
  axios
    .get(`${apiBaseUrl}/api/hello`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

//const ApiTest = () => <Button onClick={getApi}>Test</Button>;
const ApiTest = () => <div></div>;

export default ApiTest;
