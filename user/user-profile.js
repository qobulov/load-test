import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken, appId } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/user/get?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

const payload = JSON.stringify({
    data: {
        app_id: appId,
    },
});

export default function () {
    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has user': (r) => {
            try {
                const json = r.json();
                return json && json.data && json.data !== undefined;
            } catch (_) {
                return false;
            }
        },
    });
}
