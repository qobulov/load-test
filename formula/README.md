# Formula Function Gateway — Load Tests

## O'rnatish

```bash
brew install k6
```

## Struktura

```
load-tests/
├── config.js                          # URL, auth, testOptions, invoke()
├── daily-progress/
│   └── get-daily-progress.js
├── nutrition/
│   ├── get-nutrition-page.js
│   └── get-food-history.js
├── food/
│   ├── get-all-foods.js
│   └── log-food.js                    # FOOD_ID kerak
├── courses/
│   ├── get-courses.js
│   └── get-course-progress.js
├── achievements/
│   └── get-achievements.js
├── water/
│   ├── get-water-logs.js
│   └── log-water.js
├── habits/
│   ├── get-meal-habits.js
│   └── log-meal-habit.js              # HABIT_ID kerak
├── activities/
│   └── get-activities.js
├── steps/
│   └── create-activity-log-steps.js   # race condition tekshiruvi
└── streak/
    └── get-streak-week.js
```

## Ishga tushirish

```bash
# Read endpoint'lar
k6 run --env USER_ID=<guid> load-tests/daily-progress/get-daily-progress.js
k6 run --env USER_ID=<guid> load-tests/nutrition/get-nutrition-page.js
k6 run --env USER_ID=<guid> load-tests/nutrition/get-food-history.js
k6 run --env USER_ID=<guid> load-tests/food/get-all-foods.js
k6 run --env USER_ID=<guid> load-tests/courses/get-courses.js
k6 run --env USER_ID=<guid> load-tests/courses/get-course-progress.js
k6 run --env USER_ID=<guid> load-tests/achievements/get-achievements.js
k6 run --env USER_ID=<guid> load-tests/water/get-water-logs.js
k6 run --env USER_ID=<guid> load-tests/habits/get-meal-habits.js
k6 run --env USER_ID=<guid> load-tests/activities/get-activities.js
k6 run --env USER_ID=<guid> load-tests/streak/get-streak-week.js

# Write endpoint'lar
k6 run --env USER_ID=<guid> --env FOOD_ID=<guid>  load-tests/food/log-food.js
k6 run --env USER_ID=<guid>                        load-tests/water/log-water.js
k6 run --env USER_ID=<guid> --env HABIT_ID=<guid>  load-tests/habits/log-meal-habit.js
k6 run --env USER_ID=<guid>                        load-tests/steps/create-activity-log-steps.js
```

## Default yuk (config.js)

```
10s → 50 VU
30s → 200 VU
10s → 0 VU
```

Threshold: `p(95) < 2000ms`, `error rate < 1%`

## steps race condition tekshiruvi

```sql
SELECT COUNT(*) FROM activity_logs
WHERE users_id = '<USER_ID>'
  AND activity_type = 'steps'
  AND recorded_at::date = CURRENT_DATE
  AND deleted_at IS NULL;
-- Natija: 1 (upsert, duplicate bo'lmasligi kerak)
```
