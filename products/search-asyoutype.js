import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, projectId, environmentId, headers, testOptions, authToken, appId } from '../config.js';

export const options = testOptions;

const url = `${baseUrl}/content/search/asyoutype?project-id=${projectId}`;

const customHeaders = Object.assign({}, headers, {
    'environment-id': environmentId,
    'Authorization': `Bearer ${authToken}`,
});

// Test uchun qidiruv so'zlari
const searchTerms = [
    'dell',
    'ofs'
];

export default function () {
    // Random qidiruv so'zi tanlash
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const payload = JSON.stringify({
        data: {
            app_id: appId,
            search: randomTerm,
        },
    });

    const res = http.post(url, payload, { headers: customHeaders });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has results': (r) => {
            try {
                const json = r.json();
                return json && json.data !== undefined;
            } catch (_) {
                return false;
            }
        },
    });
}
