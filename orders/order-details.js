import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/order/details?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

export default function () {
    const payload = JSON.stringify({
        data: {
            order_id: "758a587f-8ff8-41c0-9981-aa18260b4fae",
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has order': (r) => r.json().data !== undefined,
    });

    sleep(1);
}
