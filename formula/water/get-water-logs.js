import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

export default function () {
    const res = http.post(baseUrl, invoke('get_water_logs'), { headers });

    check(res, {
        'status is 200': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has total': (r) => {
            try { return r.json().data.total !== undefined; } catch (_) { return false; }
        },
    });

    sleep(1);
}
