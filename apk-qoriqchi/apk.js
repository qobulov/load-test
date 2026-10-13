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
function generateUniqueTestIPs(count) {
  if (count < 1 || count > 254) {
    throw new Error('count 1 dan 254 gacha bo‘lishi kerak');
  }

  return Array.from(
    { length: count },
    (_, index) => `192.0.2.${index + 1}`
  );
}
// Har bir VU (user) uchun o'ziga xos random IP
const clientIp = generateUniqueTestIPs(100);

export default function () {
  const userId = `test-user-${__VU}`;
  const simulatedIP = testIPs[__VU - 1];
  const requestParams = {
    headers: {
      'X-Forwarded-For': simulatedIP,
      'X-Real-IP': simulatedIP,
      'CF-Connecting-IP': simulatedIP,
      'Content-Type': 'application/json',
    },
    timeout: '15s',
  };

  // Requestlarni 0–15 soniya oralig'ida yoyish
  sleep(1 + Math.random() * 14);

  // 1. Birinchi endpoint
  const res1 = http.get(endpoints[0], {
    ...requestParams,
    tags: { endpoint: 'A' },
  });
  
  check(res1, {
    'Endpoint A: HTTP 200': (r) => r.status === 200,
  });

  console.log(
    `[A] user=${userId} ip=${simulatedIP} status=${res1.status} ` +
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
    `[B] user=${userId} ip=${simulatedIP} status=${res2.status} ` +
    `duration=${res2.timings.duration.toFixed(0)}ms`
  );
}