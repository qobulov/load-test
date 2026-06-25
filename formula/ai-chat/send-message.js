import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseUrl, headers, testOptions, invoke } from '../config.js';

export const options = testOptions;

// k6 run load-tests/ai-chat/send-message.js

const messages = [
    'Salom',
    'Bugun qanday ovqatlanishim kerak?',
    'Kaloriya normam qancha?',
    'Mening vaznim 75 kg, bo\'yim 175 cm',
    'Protein qancha iste\'mol qilishim kerak?',
];

export default function () {
    const message = messages[Math.floor(Math.random() * messages.length)];

    const res = http.post(baseUrl, invoke('ai_chat_send', { message }), { headers });

    check(res, {
        'status is 201': (r) => r.status === 201,
        'no subscription error': (r) => {
            try {
                return r.json()?.data?.data?.error !== 'SUBSCRIPTION_REQUIRED';
            } catch (_) { return false; }
        },
        'has reply': (r) => {
            try {
                const d = r.json()?.data?.data;
                return d?.reply !== undefined || d?.message !== undefined;
            } catch (_) { return false; }
        },
    });

    sleep(1);
}
