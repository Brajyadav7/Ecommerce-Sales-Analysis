-- =====================================================
-- E-Commerce Sales Analysis
-- Database: zepto
-- Table: ecommerce_data
-- =====================================================




-- I use zepto because in mysql I imported this file in zepto database and i want to use it for my analysis
USE zepto;

-- 1. CHECK TABLE STRUCTURE

SHOW COLUMNS FROM ecommerce_data;

-- 2. KEY BUSINESS METRICS

-- Total Revenue
SELECT SUM(`Sale Price`) AS Total_Revenue
FROM ecommerce_data;

-- Total Orders
SELECT COUNT(`OrderID`) AS Total_Orders
FROM ecommerce_data;

-- 3. SALES ANALYSIS

-- Revenue by Product Category
SELECT `Product Category`,
       SUM(`Sale Price`) AS Revenue
FROM ecommerce_data
GROUP BY `Product Category`
ORDER BY Revenue DESC;

-- Top 10 Products by Revenue
SELECT `Product`,
       SUM(`Sale Price`) AS Revenue
FROM ecommerce_data
GROUP BY `Product`
ORDER BY Revenue DESC
LIMIT 10;

-- Orders by Zone
SELECT `Zone`,
       COUNT(`OrderID`) AS Total_Orders
FROM ecommerce_data
GROUP BY `Zone`;



-- 4. CUSTOMER FEEDBACK ANALYSIS

-- Average Rating by Category
SELECT `Product Category`,
       AVG(`Rating`) AS Avg_Rating
FROM ecommerce_data
GROUP BY `Product Category`;



-- 5. REVENUE TREND ANALYSIS

-- Monthly Revenue Trend
SELECT 
    YEAR(`OrderDate`) AS Year,
    MONTH(`OrderDate`) AS Month,
    SUM(`Sale Price`) AS Revenue
FROM ecommerce_data
GROUP BY Year, Month
ORDER BY Year, Month;




-- 6. ADVANCED ANALYSIS (WINDOW FUNCTIONS + CTE)

-- Top 5 Products in Each Category
WITH product_revenue AS (
    SELECT 
        `Product Category`,
        `Product`,
        SUM(`Sale Price`) AS revenue
    FROM ecommerce_data
    GROUP BY `Product Category`, `Product`
)

SELECT *
FROM (
    SELECT *,
           RANK() OVER(PARTITION BY `Product Category` ORDER BY revenue DESC) AS rank_in_category
    FROM product_revenue
) ranked
WHERE rank_in_category <= 5;



-- 7. CUSTOMER LIFETIME VALUE (CLV)

SELECT 
    `CustomerID`,
    SUM(`Sale Price`) AS lifetime_value,
    COUNT(`OrderID`) AS total_orders
FROM ecommerce_data
GROUP BY `CustomerID`
ORDER BY lifetime_value DESC
LIMIT 10;




-- 8. MONTHLY REVENUE GROWTH (WINDOW FUNCTION)

WITH monthly_sales AS (
    SELECT 
        YEAR(`OrderDate`) AS year,
        MONTH(`OrderDate`) AS month,
        SUM(`Sale Price`) AS revenue
    FROM ecommerce_data
    GROUP BY year, month
)

SELECT 
    year,
    month,
    revenue,
    LAG(revenue) OVER(ORDER BY year, month) AS previous_month_revenue,
    revenue - LAG(revenue) OVER(ORDER BY year, month) AS revenue_growth
FROM monthly_sales;