import { baseUrl } from '../../params';

async function posData(payload) {
  console.log('log payload user pass before fetch pos');
  console.log(payload);
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/integration/customer/token`,
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // Authorization: `Bearer ${adminToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({
        username: payload.payload.username, // roni_cost@example.com
        password: payload.payload.password // roni_cost3@example.com
      }) // body data type must match "Content-Type" header
    }
  );
  console.log('step 1:');
  const data = await response.json(); // parses JSON response into native JavaScript objects
  console.log('step 2:');
  console.log(data);
  return data;
}
export default async function AuthenService(payload) {
  try {
    const data = await posData(payload);
    console.log('go try');
    console.log(data);
    return data;
  } catch (error) {
    console.log('go error');
    console.log(error);
    return error;
  }
}
