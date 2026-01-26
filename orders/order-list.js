import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken, appId } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/order/list?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

const statuses = ['waiting', 'paid', 'assembling', 'shipping', 'delivered', 'cancelled'];

export default function () {
    // Random status tanlash yoki hammasi
    const randomStatus = Math.random() > 0.5 ? statuses[Math.floor(Math.random() * statuses.length)] : '';

    const payload = JSON.stringify({
        data: {
            app_id: appId,
            status: randomStatus,
            page: 1,
            limit: 5,
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has orders': (r) => {
            try {
                const json = r.json();
                return json && json.data !== undefined;
            } catch (_) {
                return false;
            }
        },
    });
}
