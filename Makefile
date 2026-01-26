# Ajratilgan testlar uchun script
# Har bir test uchun alohida terminal ochib ishga tushirish mumkin

# PUBLIC API'lar (Auth kerak emas)
run-public-tests:
	@echo "Running public API tests..."
	k6 run main-page/banner-list.js
	k6 run main-page/partner-list.js

# PRODUCT API'lari (Auth kerak)
run-product-tests:
	@echo "Running product API tests..."
	k6 run products/product-list.js
	k6 run products/category-list.js
	k6 run products/search-asyoutype.js

# CART API'lari (Auth kerak)
run-cart-tests:
	@echo "Running cart API tests..."
	k6 run cart/cart-items-list.js

# ORDER API'lari (Auth kerak)
run-order-tests:
	@echo "Running order API tests..."
	k6 run orders/order-list.js

# USER API'lari (Auth kerak)
run-user-tests:
	@echo "Running user API tests..."
	k6 run user/user-profile.js

# Eng muhim API'larni test qilish (quick test)
quick-test:
	@echo "Running quick tests for most important APIs..."
	k6 run --duration 30s --vus 100 products/product-list.js
	k6 run --duration 30s --vus 100 cart/cart-items-list.js
	k6 run --duration 30s --vus 100 orders/order-list.js

# Barcha testlar
all:
	@bash run-all-tests.sh

.PHONY: run-public-tests run-product-tests run-cart-tests run-order-tests run-user-tests quick-test all
