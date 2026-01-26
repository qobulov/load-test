import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/order/details?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

// Test uchun order ID lari (real ID larni kiriting)
const orderIds = [
    '46c38a32-8971-46b1-a63d-d35d8652b43c',
    'f2682759-ecf8-42b1-8fdc-df9ecadfb400',
];

export default function () {
    // Random order ID tanlash
    const randomOrderId = orderIds[Math.floor(Math.random() * orderIds.length)];

    const payload = JSON.stringify({
        data: {
            order_id: randomOrderId,
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has order': (r) => {
            try {
                const json = r.json();
                return json && json.data && json.data !== undefined;
            } catch (_) {
                return false;
            }
        },
    });

    sleep(1);
}
