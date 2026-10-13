import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    two_endpoints: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 100,
      maxDuration: '30m',
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
  const userId = `test-user-${__ITER + 1}`;
  const simulatedIP = clientIp[__ITER];
  const requestParams = {
    headers: {
      'X-Forwarded-For': simulatedIP,
      'X-Real-IP': simulatedIP,
      'CF-Connecting-IP': simulatedIP,
      'Content-Type': 'application/json',
    },
    timeout: '15s',
  };



// Har bir user uchun tasodifiy bitta endpoint tanlash
const endpointIndex = Math.floor(Math.random() * endpoints.length);
const endpoint = endpoints[endpointIndex];
const endpointName = endpointIndex === 0 ? 'A' : 'B';

const res = http.get(endpoint, {
  timeout: '15s',
  tags: { endpoint: endpointName },
});

check(res, {
  [`Endpoint ${endpointName}: HTTP 200`]: (r) => r.status === 200,
});

console.log(
  `[${endpointName}] user=${userId} ` +
  `status=${res.status} ` +
  `duration=${res.timings.duration.toFixed(0)}ms`+
  `ip=${simulatedIP}`
);
  // Requestlarni 0–15 soniya oralig'ida yoyish
  sleep(5 + Math.random() * 15);
}