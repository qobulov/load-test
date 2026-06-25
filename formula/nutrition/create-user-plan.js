import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

// k6 run load-tests/nutrition/create-user-plan.js
// Parallel plan creation/update — idempotency tekshiruvi
// DB tekshir (faqat 1 aktiv plan bo'lishi kerak):
// SELECT COUNT(*) FROM user_plans
// WHERE users_id='d7d3e774-8e33-402e-b5bf-da966a596668' AND deleted_at IS NULL;

const activityLevels = ['sedentary', 'light', 'moderate', 'high'];

export default function () {
    const level = activityLevels[Math.floor(Math.random() * activityLevels.length)];

    const res = http.post(baseUrl, invoke('create_user_plan', {
        weight_kg: 80,
        goal_weight_kg: 72,
        height_cm: 178,
        waist_cm: 90,
        goal_waist_cm: 85,
        birthdate: '1990-05-15',
        activity_level: level,
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().status === 'success'; } catch (_) { return false; }
        },
        'has calorie_target': (r) => {
            try { return r.json().data.daily_calories_target > 0; } catch (_) { return false; }
        },
    });

    sleep(1);
}
