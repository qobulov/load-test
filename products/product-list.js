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
        'response has data': (r) => {
            try {
                const json = r.json();
                return json && json.data !== undefined;
            } catch (_) {
                return false;
            }
        },
        'has products': (r) => {
            const json = r.json();
            return json.data && Array.isArray(json.data.data) && json.data.data.length > 0;
        },
    });
}
