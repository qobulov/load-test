import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    two_endpoints: {
      executor: 'per-vu-iterations',
      vus: 100,
      iterations: 1,
      maxDuration: '2m',
    },
  },
};

const endpoints = [
  'https://project.cybercontrol.uz/r/83_mfzMiX_tGBKg8EBr71A/javob/NDUzMjg4MA:1xGUaJ:i8YQN33tvb44suQzlwoiNARvSxSSV2gg5yj-fn5J5lQ/yosh',
  'https://project.cybercontrol.uz/r/83_mfzMiX_tGBKg8EBr71A/javob/NDUzMjg4MA:1xGUaJ:i8YQN33tvb44suQzlwoiNARvSxSSV2gg5yj-fn5J5lQ/nafaqa',
];


// Tasodifiy unikal IP generatsiya qilish (10.x.x.x diapazonida)
function getRandomIp() {
  const o2 = Math.floor(Math.random() * 255);
  const o3 = Math.floor(Math.random() * 255);
  const o4 = Math.floor(Math.random() * 254) + 1;
  return `10.${o2}.${o3}.${o4}`;
}

export default function () {
  const userId = `test-user-${__VU}`;
  
  // Har bir VU (user) uchun o'ziga xos random IP
  const clientIp = getRandomIp();

  const requestParams = {
    headers: {
      'X-Forwarded-For': clientIp,
      'X-Real-IP': clientIp,
      'CF-Connecting-IP': clientIp,
      'Content-Type': 'application/json',
    },
    timeout: '15s',
  };

  // Requestlarni 0–15 soniya oralig'ida yoyish
  sleep(Math.random() * 15);

  // 1. Birinchi endpoint
  const res1 = http.get(endpoints[0], {
    ...requestParams,
    tags: { endpoint: 'A' },
  });

  check(res1, {
    'Endpoint A: HTTP 200': (r) => r.status === 200,
  });

  console.log(
    `[A] user=${userId} ip=${clientIp} status=${res1.status} ` +
    `duration=${res1.timings.duration.toFixed(0)}ms`
  );

  sleep(1);

  // 2. Ikkinchi endpoint (aynan shu userning clientIp manzili bilan ketadi)
  const res2 = http.get(endpoints[1], {
    ...requestParams,
    tags: { endpoint: 'B' },
  });

  check(res2, {
    'Endpoint B: HTTP 200': (r) => r.status === 200,
  });

  console.log(
    `[B] user=${userId} ip=${clientIp} status=${res2.status} ` +
    `duration=${res2.timings.duration.toFixed(0)}ms`
  );
}