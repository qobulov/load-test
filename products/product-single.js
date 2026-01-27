import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, appId } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/content/product/single?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
});

export default function () {
    const payload = JSON.stringify({
        data: {
            app_id: appId,
            product_group_id: __ITER % 3 === 0 ? "6ce59315-a6ed-41f7-b02a-5586fab0d6f8" : "6ce59315-a6ed-41f7-b02a-5586fab0d6f8",
        },
    });
    
    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has product': (r) => {
            try {
                const json = r.json();
                return json && json.data && json.data.guid;
            } catch (_) {
                return false;
            }
        },
    });
}
