import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  iterations: 100,
};

function randomTestIP() {
  // Hujjatlar va testlar uchun ajratilgan IP diapazoni
  return `192.0.2.${Math.floor(Math.random() * 254) + 1}`;
}

export default function () {
  const randomIP = randomTestIP();

  const params = {
    headers: {
      'X-Forwarded-For': randomIP,
      'True-Client-IP': randomIP,
      'Content-Type': 'application/json',
    },
    timeout: '10s',
  };
  console.log(
    `[START] VU=${__VU} ITER=${__ITER} TEST_IP=${randomIP}`
  );

const res = http.get(
  'https://project.cybercontrol.uz/r/83_mfzMiX_tGBKg8EBr71A/javob/Mzg0MDkyNA:1xG8vm:rR6LkL6o7H-BwkY3nEWOYtGTXVtwtUrS4s4umHrtoMU/yosh',
  params
);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  console.log(
    `VU=${__VU} ITER=${__ITER} TEST_IP=${randomIP} STATUS=${res.status}`
  );
}