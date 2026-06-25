import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

// k6 run load-tests/water/log-water.js
// DB tekshir:
// SELECT SUM(amount_ml) FROM water_logs
// WHERE users_id='d7d3e774-8e33-402e-b5bf-da966a596668' AND logged_at::date=CURRENT_DATE AND deleted_at IS NULL;

const amounts = [200, 250, 300, 350, 500];

export default function () {
    const amount = amounts[Math.floor(Math.random() * amounts.length)];

    const res = http.post(baseUrl, invoke('log_water', {
        amount_ml: amount,
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has total_ml': (r) => {
            try { return r.json().data.total_ml !== undefined; } catch (_) { return false; }
        },
    });

    sleep(1);
}
