import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke, habitId } from '../config.js';

export const options = testOptions;

// k6 run --env USER_ID=<guid> --env HABIT_ID=<guid> load-tests/habits/log-meal-habit.js

const today = new Date().toISOString().slice(0, 10);

export default function () {
    if (!habitId) {
        console.error('HABIT_ID env required');
        return;
    }

    const res = http.post(baseUrl, invoke('log_meal_habit', {
        habit_id: habitId,
        date: today,
        is_done: true,
    }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response success': (r) => {
            try { return r.json().data.status === 'success'; } catch (_) { return false; }
        },
    });

    sleep(1);
}
