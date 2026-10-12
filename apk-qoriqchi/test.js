import http from 'k6/http';
import { check } from 'k6';

const url = 'https://project.cybercontrol.uz/r/83_mfzMiX_tGBKg8EBr71A/javob/Mzg0MDkyNA:1xG8vm:rR6LkL6o7H-BwkY3nEWOYtGTXVtwtUrS4s4umHrtoMU/yosh';

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const res = http.get(url, {
    timeout: '15s',
    tags: { test_type: 'single_request' },
  });

  console.log(`Status: ${res.status}`);
  console.log(`Duration: ${res.timings.duration} ms`);

  check(res, {
    'HTTP status is 2xx or 3xx': (r) =>
      r.status >= 200 && r.status < 400,
  });
}