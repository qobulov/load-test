import http from 'k6/http';
import { check, sleep } from 'k6';

// 10 ta proksi ro'yxati
const proxyList = [
  'http://aaupjlot:qnj8c1w63clx@45.38.107.97:6014',
  'http://aaupjlot:qnj8c1w63clx@64.137.96.74:6641',
  'http://aaupjlot:qnj8c1w63clx@198.23.243.226:6361',
  'http://aaupjlot:qnj8c1w63clx@38.154.185.97:6370',
  'http://aaupjlot:qnj8c1w63clx@84.247.60.125:6095',
  'http://aaupjlot:qnj8c1w63clx@191.96.254.138:6185',
  'http://aaupjlot:qnj8c1w63clx@198.46.161.42:5092',
  'http://aaupjlot:qnj8c1w63clx@64.137.10.153:5803',
  'http://aaupjlot:qnj8c1w63clx@104.164.49.38:7693',
  'http://aaupjlot:qnj8c1w63clx@23.26.71.145:5628',
];

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

export default function () {
  const userId = `test-user-${__VU}`;
  
  // 100 ta VU o'rtasida 10 ta proksini teng taqsimlash
  const assignedProxy = proxyList[(__VU - 1) % proxyList.length];

  const requestParams = {
    // xk6-proxy orqali yig'ilganda ishlaydi
    proxy: assignedProxy,
    timeout: '15s',
  };

  sleep(Math.random() * 15);

  const res1 = http.get(endpoints[0], {
    ...requestParams,
    tags: { endpoint: 'A' },
  });

  check(res1, {
    'Endpoint A: HTTP 200': (r) => r.status === 200,
  });

  console.log(`[A] user=${userId} via=${assignedProxy.split('@')[1]} status=${res1.status}`);

  sleep(1);

  const res2 = http.get(endpoints[1], {
    ...requestParams,
    tags: { endpoint: 'B' },
  });

  check(res2, {
    'Endpoint B: HTTP 200': (r) => r.status === 200,
  });

  console.log(`[B] user=${userId} via=${assignedProxy.split('@')[1]} status=${res2.status}`);
}