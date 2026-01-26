import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/content/product/single?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

export default function () {
    const payload = JSON.stringify({
        data: {
            product_id: "c29f75b5-cc3d-4241-afc5-eb42acb61a7d",
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has product': (r) => {
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
