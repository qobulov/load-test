import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken, appId } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/order/details?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

export default function () {
    const payload = JSON.stringify({
        data: {
            app_id: appId,
            order_id: __ITER % 3 === 0 ? "758a587f-8ff8-41c0-9981-aa18260b4fae" : "9e5fbccb-1eaa-4d9c-9ef1-54ed4e17dd9e",
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has order': (r) => {
            try {
                const json = r.json();
                return json && json.data != null;
            } catch (_) {
                return false;
            }
        },
    });
}
