import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/test?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
});

const payload = JSON.stringify({
    data: {},
});

export default function () {
    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has data': (r) => {
            try {
                const json = r.json();
                return json && json.status !== undefined;
            } catch (_) {
                return false;
            }
        },
    });

    sleep(1);
}
