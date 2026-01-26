// Kansler Load Test Configuration

export const baseUrl = 'https://api.admin.u-code.io/v2/invoke_function/kansler-function-gateway-knative';
export const projectId = 'b24d8fb3-0532-4cd9-ae84-db84f993e93d'; 
export const environmentId = 'ca6ac079-6003-462a-9787-80e1b286079d'; 

// Auth token (kerak bo'lganda)
export const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIiLCJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImI0YjFhNjczLTM3YjYtNDNhMy04MGM5LTFmY2RhZTAzZDFiMSIsImRhdGEiOiJHby1odHRwLWNsaWVudC8yLjAiLCJleHAiOjE3Njk0ODgwODIsImlhdCI6MTc2OTQwMTY4MiwiaWQiOiI1OWE3YmExNi1jN2VhLTRjZjMtOTIxNy1jODhlMzdiMGEwNTUiLCJpcCI6IjEwLjEwLjAuMy8zMiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VycyIsInByb2plY3RfaWQiOiJiMjRkOGZiMy0wNTMyLTRjZDktYWU4NC1kYjg0Zjk5M2U5M2QiLCJyb2xlX2lkIjoiNzk0ODEyMmEtZjIyOS00MjU2LWE5N2ItZWRlOTYyOWY3ZTZhIiwidGFibGVzIjpbXSwidXNlcl9pZCI6ImIyNTg0MmIwLTZkYzEtNDRiMy1hZmU1LTc0NGY0YWQ3NzY2OCIsInVzZXJfaWRfYXV0aCI6IjI2MDMxOTRkLTBiNjItNDliOC04NTE3LTA3NmIwMWM0Njg5MCJ9.8-vFLORVa9FGxjJxeCLPXtUHzsX00XuXNJwPHVzyT-Y';

// Default headers
export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${authToken}`,
};

// Load test options
export const testOptions = {
  scenarios: {
    target_rps: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 300,
      maxVUs: 1200,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};
