import http from 'k6/http';
import { check } from 'k6';

const url = 'https://project.cybercontrol.uz/r/83_mfzMiX_tGBKg8EBr71A/javob/Mzg1NTkwMw:1xG9DS:aip-GJIowsfUo9tWIJekZYbxLmT-8z2PL_FvYpls_G4/nafaqa';

export const options = {
  vus: 2,
  iterations: 30,
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