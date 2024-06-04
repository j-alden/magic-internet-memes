import React from 'react';
import axios from 'axios';

import { Button } from '@mantine/core';

const getApi = () => {
  axios
    .get('/api/hello')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const ApiTest = () => <Button onClick={getApi}>Test</Button>;

export default ApiTest;
