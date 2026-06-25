import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

// k6 run load-tests/activities/create-activity-log-weight.js
// Bir kunda parallel upsert — race condition tekshiruvi (faqat 1 qator bo'lishi kerak)
// DB tekshir:
// SELECT COUNT(*) FROM activity_logs
// WHERE users_id='d7d3e774-8e33-402e-b5bf-da966a596668' AND activity_type='weight' AND recorded_at::date=CURRENT_DATE AND deleted_at IS NULL;

const today = new Date().toISOString().slice(0, 10);

export default function () {
    const weight = (70 + Math.random() * 5).toFixed(1); // 70.0–75.0 kg

    const res = http.post(baseUrl, invoke('create_activity_log', {
        activity_type: 'weight',
        value: parseFloat(weight),
        source: 'manual',
        recorded_at: today + 'T08:00:00Z',
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
    });

    sleep(1);
}
