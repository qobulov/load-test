import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

const today = new Date().toISOString().slice(0, 10);

export default function () {
    const res = http.post(baseUrl, invoke('get_food_history', { date: today }), { headers });

    check(res, {
        'status is 200': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has foods array': (r) => {
            try { return Array.isArray(r.json().data.foods); } catch (_) { return false; }
        },
    });

    sleep(1);
}
