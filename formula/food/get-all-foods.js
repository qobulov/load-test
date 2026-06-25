import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

const searches = ['tovuq', 'tuxum', 'non', 'guruch', 'go\'sht', 'sabzi', 'olma', ''];

export default function () {
    const search = searches[Math.floor(Math.random() * searches.length)];

    const res = http.post(baseUrl, invoke('get_all_foods', { page: 1, limit: 20, search }), { headers });

    check(res, {
        'status is 200': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has foods array': (r) => {
            try { return Array.isArray(r.json().data.data); } catch (_) { return false; }
        },
    });

    sleep(1);
}
