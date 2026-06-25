import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

export default function () {
    const res = http.post(baseUrl, invoke('get_meal_habits'), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().data.status === 'success'; } catch (_) { return false; }
        },
        'has data': (r) => {
            try { return r.json().data.data !== undefined; } catch (_) { return false; }
        },
    });

    sleep(1);
}
