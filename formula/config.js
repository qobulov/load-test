// Formula Function Gateway — Load Test Configuration

export const baseUrl = 'https://api.admin.u-code.io/v2/invoke_function/formula-function-gateway?project-id=592e6339-d867-489e-8e6a-74ea28e0818d';
export const appId   = 'P-Cl2Mu4dDYXm3fvK6MspxVXTn0QogRRb7';

// Auth: env var orqali yuboriladi
// k6 run --env USER_ID=<guid> --env FOOD_ID=<guid> script.js
export const userId = "37dc73d3-86b0-4798-ab57-eea77768dc32"  || '';
export const foodId = "410318ab-24c7-45b7-bcbd-73f41dc3f235"  || '';
export const habitId = "bc31000c-ca97-435f-a91d-a1bc1b567506"  || '';
export const token  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIiLCJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImVkM2U1YmQ4LWY5MTktNGI4NS04MmM2LWViNTAwN2Y0OTg2YiIsImRhdGEiOiJHby1odHRwLWNsaWVudC8yLjAiLCJleHAiOjE3ODIyMjY0OTQsImlhdCI6MTc4MjE0MDA5NCwiaWQiOiJjZmZkY2E1NC01YjJiLTQ3M2EtOTc4MS02NzdiYTk4MzViNTYiLCJpcCI6IjEwLjEwLjAuMy8zMiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VycyIsInByb2plY3RfaWQiOiI1OTJlNjMzOS1kODY3LTQ4OWUtOGU2YS03NGVhMjhlMDgxOGQiLCJyb2xlX2lkIjoiN2I2NTk0NDEtYzRkNC00OTUwLWI0ZjgtNGUxM2ZkYzViMDM3IiwidGFibGVzIjpbXSwidXNlcl9pZCI6ImQ3ZDNlNzc0LThlMzMtNDAyZS1iNWJmLWRhOTY2YTU5NjY2OCIsInVzZXJfaWRfYXV0aCI6ImFiMzczNzVhLTY0YmItNDBlYi1iN2I5LWUyY2Q5NmFhODI4OCJ9.2Xo3UiJA8fhfjOorY-iPV8rql_xDD9B1v2zQ2Ok5CQU";

// export const headers = {
//     'Content-Type': 'application/json',
//     'authorization': 'API-KEY',
//     'X-API-KEY': appId,
// };
export const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Environment-Id': '86bbff40-93c1-4af4-88fb-33b1e908f6cc',
    'Authorization': `Bearer ${token}`,
};
export const queryParams = {
  "project-id": "592e6339-d867-489e-8e6a-74ea28e0818d"
}

// Har bir endpoint fayli `testOptions`ni import qilib ishlatadi
export const testOptions = {
    stages: [
        { duration: '10s', target: 50  },
        { duration: '30s', target: 200 },
        { duration: '10s', target: 0   },
    ],
    thresholds: {
        http_req_failed:   ['rate<0.01'],
        http_req_duration: ['p(95)<2000'],
    },
};

// invoke() — formula function'larini chaqirish uchun yordamchi
export function invoke(method, objectData = {}, lang = 'uz') {
    return JSON.stringify({
        data: {
            method,
            object_data: { ...objectData, lang },
        },
    });
}
