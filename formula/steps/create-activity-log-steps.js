import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

// Bir xil sana uchun parallel upsert — race condition tekshiruvi
// Test tugagandan keyin DB tekshir (faqat 1 qator bo'lishi kerak):
// SELECT COUNT(*) FROM activity_logs
// WHERE users_id='<USER_ID>' AND activity_type='steps' AND recorded_at::date=CURRENT_DATE AND deleted_at IS NULL;

const today = new Date().toISOString().slice(0, 10);

export default function () {
    const steps = Math.floor(Math.random() * 5000) + 5000; // 5000-10000

    const res = http.post(baseUrl, invoke('create_activity_log', {
        activity_type: 'steps',
        value: steps,
        source: 'manual',
        recorded_at: today + 'T10:00:00Z',
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().data.status === 'success'; } catch (_) { return false; }
        },
    });

    sleep(1);
}
