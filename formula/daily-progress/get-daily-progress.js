import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

const today = new Date().toISOString().slice(0, 10);

export default function () {
    const res = http.post(baseUrl, invoke('get_daily_progress', { date: today }), { headers });

    check(res, {
        'status is 200': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has calories': (r) => {
            try { return r.json().data !== undefined; } catch (_) { return false; }
        },
    });

    sleep(1);
}
