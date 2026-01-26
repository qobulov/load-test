import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/content/product/list?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

const payload = JSON.stringify({
    data: {
        filter_type: "new",
        search: "",
        page: 1,
        limit: 5,
    },
});

export default function () {
    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is JSON': (r) => {
            try {
                r.json();
                return true;
            } catch (_) {
                return false;
            }
        },
        'has products': (r) => {
            try {
                const json = r.json();
                return json && json.data && Array.isArray(json.data.data) && json.data.data.length > 0;
            } catch (_) {
                return false;
            }
        },
    });
}
