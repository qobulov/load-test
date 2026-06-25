import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke, foodId } from '../config.js';

export const options = testOptions;

// k6 run --env USER_ID=<guid> --env FOOD_ID=<guid> load-tests/food/log-food.js
// Test tugagandan keyin DB tekshir:
// SELECT COUNT(*) FROM food_logs WHERE users_id='<USER_ID>' AND logged_at::date=CURRENT_DATE AND deleted_at IS NULL;

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function () {
    if (!foodId) {
        console.error('FOOD_ID env required');
        return;
    }

    const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];

    const res = http.post(baseUrl, invoke('log_food', {
        foods_id: foodId,
        amount: 100,
        type: mealType,
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().data.status === 'success'; } catch (_) { return false; }
        },
        'has food_name': (r) => {
            try { return r.json().data.data.food_name !== undefined; } catch (_) { return false; }
        },
    });

    sleep(1);
}
