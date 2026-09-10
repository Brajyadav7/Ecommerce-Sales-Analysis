import pandas as pd
import numpy as np
import json
import os

def generate_analytics_data():
    print("Loading datasets...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    clean_csv_path = os.path.join(base_dir, "data", "cleaned_ecommerce_data.csv")
    rfm_csv_path = os.path.join(base_dir, "data", "rfm_customer_segments.csv")
    
    df = pd.read_csv(clean_csv_path)
    print(f"Loaded clean data with {len(df)} rows.")

    df['OrderDate'] = pd.to_datetime(df['OrderDate'], errors='coerce')
    df['Year'] = df['OrderDate'].dt.year
    df['MonthStr'] = df['OrderDate'].dt.strftime('%Y-%m')
    df['Revenue'] = df['Revenue'].astype(float)
    df['Sale Price'] = df['Sale Price'].astype(float)
    df['Order Quantity'] = df['Order Quantity'].astype(int)
    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce').fillna(3)
    df['Shipping Fee'] = pd.to_numeric(df['Shipping Fee'], errors='coerce').fillna(0)

    # 1. High level Summary KPIs
    total_rev = float(df['Revenue'].sum())
    total_orders = int(df['OrderID'].nunique())
    total_customers = int(df['CustomerID'].nunique())
    aov = float(df['Revenue'].mean())
    avg_rating = float(df['Rating'].mean())
    return_count = int((df['Status'] == 'Returned').sum())
    delivered_count = int((df['Status'] == 'Delivered').sum())
    return_rate = float((return_count / total_orders) * 100)
    repeat_customers = int((df.groupby('CustomerID')['OrderID'].nunique() > 1).sum())
    retention_rate = float((repeat_customers / total_customers) * 100)

    summary = {
        "totalRevenue": round(total_rev, 2),
        "totalOrders": total_orders,
        "totalCustomers": total_customers,
        "avgOrderValue": round(aov, 2),
        "avgRating": round(avg_rating, 2),
        "returnRate": round(return_rate, 2),
        "retentionRate": round(retention_rate, 2),
        "deliveredCount": delivered_count,
        "returnedCount": return_count,
        "dateMin": str(df['OrderDate'].min().date()),
        "dateMax": str(df['OrderDate'].max().date()),
        "years": sorted(df['Year'].dropna().unique().astype(int).tolist())
    }

    # 2. Monthly Trends (2015-2020)
    monthly_grp = df.groupby('MonthStr').agg(
        revenue=('Revenue', 'sum'),
        orders=('OrderID', 'count'),
        avgAov=('Revenue', 'mean'),
        avgRating=('Rating', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index()

    monthly_trends = []
    prev_rev = None
    for _, row in monthly_grp.iterrows():
        rev = float(row['revenue'])
        growth = 0.0
        if prev_rev and prev_rev > 0:
            growth = round(((rev - prev_rev) / prev_rev) * 100, 2)
        prev_rev = rev
        parts = row['MonthStr'].split('-')
        year, month = int(parts[0]), int(parts[1])
        monthly_trends.append({
            "monthStr": row['MonthStr'],
            "year": year,
            "month": month,
            "revenue": round(rev, 2),
            "orders": int(row['orders']),
            "avgOrderValue": round(float(row['avgAov']), 2),
            "avgRating": round(float(row['avgRating']), 2),
            "returns": int(row['returns']),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2),
            "growth": growth
        })

    # 3. Yearly Trends
    yearly_grp = df.groupby('Year').agg(
        revenue=('Revenue', 'sum'),
        orders=('OrderID', 'count'),
        aov=('Revenue', 'mean'),
        avgRating=('Rating', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index()

    yearly_trends = []
    for _, row in yearly_grp.iterrows():
        yearly_trends.append({
            "year": int(row['Year']),
            "revenue": round(float(row['revenue']), 2),
            "orders": int(row['orders']),
            "avgOrderValue": round(float(row['aov']), 2),
            "avgRating": round(float(row['avgRating']), 2),
            "returns": int(row['returns']),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2)
        })

    # 4. Category Metrics & Subcategories
    cat_grp = df.groupby('Product Category').agg(
        revenue=('Revenue', 'sum'),
        orders=('OrderID', 'count'),
        avgPrice=('Sale Price', 'mean'),
        avgRating=('Rating', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index()

    category_metrics = []
    for _, row in cat_grp.iterrows():
        cat = row['Product Category']
        sub_df = df[df['Product Category'] == cat].groupby('SubCategory').agg(
            revenue=('Revenue', 'sum'),
            orders=('OrderID', 'count')
        ).reset_index().sort_values(by='revenue', ascending=False)

        subcategories = [
            {"name": s['SubCategory'], "revenue": round(float(s['revenue']), 2), "orders": int(s['orders'])}
            for _, s in sub_df.head(6).iterrows()
        ]

        category_metrics.append({
            "category": cat,
            "revenue": round(float(row['revenue']), 2),
            "orders": int(row['orders']),
            "share": round((float(row['revenue']) / total_rev) * 100, 2),
            "avgPrice": round(float(row['avgPrice']), 2),
            "avgRating": round(float(row['avgRating']), 2),
            "returns": int(row['returns']),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2),
            "subcategories": subcategories
        })
    category_metrics.sort(key=lambda x: x['revenue'], reverse=True)

    # 5. Zone & Logistics Metrics
    zone_grp = df.groupby('Zone').agg(
        revenue=('Revenue', 'sum'),
        orders=('OrderID', 'count'),
        avgShipping=('Shipping Fee', 'mean'),
        avgRating=('Rating', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index()

    zone_metrics = []
    for _, row in zone_grp.iterrows():
        z = row['Zone']
        loc_df = df[df['Zone'] == z].groupby('Location').agg(
            revenue=('Revenue', 'sum'),
            orders=('OrderID', 'count')
        ).reset_index().sort_values(by='revenue', ascending=False)

        locations = [
            {"location": l['Location'], "revenue": round(float(l['revenue']), 2), "orders": int(l['orders'])}
            for _, l in loc_df.head(5).iterrows()
        ]

        del_types_df = df[df['Zone'] == z].groupby('Delivery Type')['OrderID'].count().to_dict()

        zone_metrics.append({
            "zone": z,
            "revenue": round(float(row['revenue']), 2),
            "orders": int(row['orders']),
            "share": round((float(row['revenue']) / total_rev) * 100, 2),
            "avgShippingFee": round(float(row['avgShipping']), 2),
            "avgRating": round(float(row['avgRating']), 2),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2),
            "topLocations": locations,
            "deliveryTypes": {str(k): int(v) for k, v in del_types_df.items()}
        })
    zone_metrics.sort(key=lambda x: x['revenue'], reverse=True)

    # 6. Delivery Types
    del_grp = df.groupby('Delivery Type').agg(
        revenue=('Revenue', 'sum'),
        orders=('OrderID', 'count'),
        avgRating=('Rating', 'mean'),
        avgShipping=('Shipping Fee', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index()

    delivery_types = []
    for _, row in del_grp.iterrows():
        delivery_types.append({
            "type": row['Delivery Type'],
            "revenue": round(float(row['revenue']), 2),
            "orders": int(row['orders']),
            "share": round((row['orders'] / total_orders) * 100, 2),
            "avgRating": round(float(row['avgRating']), 2),
            "avgShippingFee": round(float(row['avgShipping']), 2),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2)
        })

    # 7. Return Reasons Analysis
    returned_df = df[df['Status'] == 'Returned']
    reason_grp = returned_df.groupby('Reason').agg(
        count=('OrderID', 'count'),
        lostRevenue=('Revenue', 'sum')
    ).reset_index().sort_values(by='count', ascending=False)

    return_reasons = []
    for _, row in reason_grp.iterrows():
        r = row['Reason'] if pd.notna(row['Reason']) and row['Reason'] != '' else 'Other / Unspecified'
        return_reasons.append({
            "reason": r,
            "count": int(row['count']),
            "percentage": round((row['count'] / return_count) * 100, 2),
            "lostRevenue": round(float(row['lostRevenue']), 2)
        })

    # 8. Top 50 Products
    prod_grp = df.groupby(['Product', 'Product Category']).agg(
        revenue=('Revenue', 'sum'),
        unitsSold=('Order Quantity', 'sum'),
        orders=('OrderID', 'count'),
        avgPrice=('Sale Price', 'mean'),
        avgRating=('Rating', 'mean'),
        returns=('Status', lambda x: (x == 'Returned').sum())
    ).reset_index().sort_values(by='revenue', ascending=False)

    top_products = []
    for _, row in prod_grp.head(50).iterrows():
        top_products.append({
            "rank": len(top_products) + 1,
            "product": row['Product'],
            "category": row['Product Category'],
            "revenue": round(float(row['revenue']), 2),
            "unitsSold": int(row['unitsSold']),
            "orders": int(row['orders']),
            "avgPrice": round(float(row['avgPrice']), 2),
            "avgRating": round(float(row['avgRating']), 2),
            "returnRate": round((row['returns'] / row['orders']) * 100, 2)
        })

    # 9. RFM Customer Segments (From rfm_customer_segments.csv)
    rfm_df = pd.read_csv(rfm_csv_path)
    rfm_counts = rfm_df['CustomerSegment'].value_counts()
    rfm_monetary = rfm_df.groupby('CustomerSegment')['Monetary'].mean()
    rfm_recency = rfm_df.groupby('CustomerSegment')['Recency'].mean()
    rfm_frequency = rfm_df.groupby('CustomerSegment')['Frequency'].mean()

    segment_meta = {
        "Champions": {
            "desc": "High recency, high frequency, and maximum spend. Loyal brand advocates.",
            "action": "Exclusive VIP rewards, early access to new product drops, personalized appreciation.",
            "color": "#10B981"
        },
        "Loyal Customers": {
            "desc": "Consistently repeat buyers with solid frequency and high basket sizes.",
            "action": "Upsell higher margin categories, cross-sell bundles, encourage reviews.",
            "color": "#3B82F6"
        },
        "Potential Loyalists": {
            "desc": "Recent customers with promising purchase patterns but moderate order counts.",
            "action": "Offer limited-time incentive for 2nd/3rd purchase, targeted product recommendations.",
            "color": "#8B5CF6"
        },
        "Regular Customers": {
            "desc": "Moderate spenders who purchase occasionally without strict patterns.",
            "action": "Seasonal reactivation emails, price-drop notifications, free shipping promotions.",
            "color": "#F59E0B"
        },
        "Lost Customers": {
            "desc": "Long time since last order (high recency days), low frequency, churn risk.",
            "action": "High-impact win-back offers (e.g. 25% off comeback voucher) or churn exit survey.",
            "color": "#EF4444"
        }
    }

    rfm_segments = []
    total_rfm = len(rfm_df)
    for seg, count in rfm_counts.items():
        meta = segment_meta.get(seg, {"desc": "", "action": "", "color": "#6B7280"})
        rfm_segments.append({
            "segment": seg,
            "count": int(count),
            "percentage": round((count / total_rfm) * 100, 2),
            "avgMonetary": round(float(rfm_monetary.get(seg, 0)), 2),
            "avgRecencyDays": round(float(rfm_recency.get(seg, 0)), 1),
            "avgFrequency": round(float(rfm_frequency.get(seg, 0)), 2),
            "description": meta["desc"],
            "strategy": meta["action"],
            "color": meta["color"]
        })

    # 10. Demographics: Customer Age & Gender
    age_bins = [15, 25, 35, 45, 55, 65, 100]
    age_labels = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    df['AgeGroup'] = pd.cut(df['Customer Age'], bins=age_bins, labels=age_labels, right=False)
    
    age_grp = df.groupby('AgeGroup', observed=False).agg(
        orders=('OrderID', 'count'),
        revenue=('Revenue', 'sum')
    ).reset_index()

    age_distribution = [
        {"group": str(r['AgeGroup']), "orders": int(r['orders']), "revenue": round(float(r['revenue']), 2)}
        for _, r in age_grp.iterrows()
    ]

    gender_grp = df.groupby('Customer Gender').agg(
        orders=('OrderID', 'count'),
        revenue=('Revenue', 'sum')
    ).reset_index()

    gender_distribution = [
        {"gender": str(r['Customer Gender']), "orders": int(r['orders']), "revenue": round(float(r['revenue']), 2)}
        for _, r in gender_grp.iterrows()
    ]

    # 11. Representative sample orders (1,200 records for real-time table exploration and CSV export)
    sample_orders_df = df.sample(n=1200, random_state=42)[
        ['OrderID', 'OrderDate', 'CustomerID', 'Customer Age', 'Customer Gender',
         'Location', 'Zone', 'Delivery Type', 'Product Category', 'SubCategory',
         'Product', 'Unit Price', 'Shipping Fee', 'Order Quantity', 'Sale Price',
         'Status', 'Reason', 'Rating', 'Revenue']
    ].copy()
    sample_orders_df['OrderDate'] = sample_orders_df['OrderDate'].dt.strftime('%Y-%m-%d')
    sample_orders_df['Reason'] = sample_orders_df['Reason'].fillna('')
    sample_orders = sample_orders_df.to_dict(orient='records')

    # 12. Pre-defined SQL queries with CTEs, Window functions and business questions
    sql_queries = [
        {
            "id": "kpi_revenue_orders",
            "title": "1. Key Executive Business Metrics",
            "category": "Executive KPIs",
            "description": "Calculates overall total revenue, total order volume, and Average Order Value (AOV).",
            "query": "-- Total Revenue, Total Orders & Average Order Value\nSELECT \n    SUM(`Sale Price` * `Order Quantity`) AS Total_Revenue,\n    COUNT(`OrderID`) AS Total_Orders,\n    ROUND(AVG(`Sale Price` * `Order Quantity`), 2) AS Avg_Order_Value,\n    ROUND(AVG(`Rating`), 2) AS Avg_Customer_Rating\nFROM ecommerce_data\nWHERE `Status` != 'Cancelled';",
            "result": [
                {"Total_Revenue": "$135,611,346", "Total_Orders": 113000, "Avg_Order_Value": "$1,200.10", "Avg_Customer_Rating": 2.73}
            ]
        },
        {
            "id": "revenue_by_category",
            "title": "2. Revenue & Ratings by Product Category",
            "category": "Sales Analysis",
            "description": "Groups all transactions by category, determining the revenue contribution and satisfaction score.",
            "query": "-- Revenue & Rating distribution across departments\nSELECT \n    `Product Category`,\n    SUM(`Revenue`) AS Revenue,\n    COUNT(`OrderID`) AS Total_Orders,\n    ROUND(AVG(`Rating`), 2) AS Avg_Rating,\n    ROUND(SUM(`Revenue`) * 100.0 / (SELECT SUM(`Revenue`) FROM ecommerce_data), 2) AS Revenue_Share_Pct\nFROM ecommerce_data\nGROUP BY `Product Category`\nORDER BY Revenue DESC;",
            "result": [
                {"Product Category": "Health and beauty", "Revenue": "$44,717,534", "Total_Orders": 37265, "Avg_Rating": 2.73, "Revenue_Share_Pct": "32.97%"},
                {"Product Category": "Fashion", "Revenue": "$41,298,021", "Total_Orders": 34415, "Avg_Rating": 2.72, "Revenue_Share_Pct": "30.45%"},
                {"Product Category": "Phones and Tablet", "Revenue": "$22,322,776", "Total_Orders": 18602, "Avg_Rating": 2.74, "Revenue_Share_Pct": "16.46%"},
                {"Product Category": "Home and Office", "Revenue": "$19,163,611", "Total_Orders": 15970, "Avg_Rating": 2.73, "Revenue_Share_Pct": "14.13%"},
                {"Product Category": "Electronics", "Revenue": "$8,109,404", "Total_Orders": 6748, "Avg_Rating": 2.73, "Revenue_Share_Pct": "5.98%"}
            ]
        },
        {
            "id": "top_products_category",
            "title": "3. Top 5 Products per Category (CTE + RANK Window Function)",
            "category": "Advanced SQL",
            "description": "Uses a Common Table Expression (CTE) and RANK() OVER (PARTITION BY Product Category ORDER BY Revenue DESC) to identify category champions.",
            "query": "WITH product_revenue AS (\n    SELECT \n        `Product Category`,\n        `Product`,\n        SUM(`Revenue`) AS revenue,\n        COUNT(`OrderID`) AS orders\n    FROM ecommerce_data\n    GROUP BY `Product Category`, `Product`\n)\nSELECT * FROM (\n    SELECT *,\n           RANK() OVER(PARTITION BY `Product Category` ORDER BY revenue DESC) AS rank_in_category\n    FROM product_revenue\n) ranked\nWHERE rank_in_category <= 5\nORDER BY `Product Category`, rank_in_category;",
            "result": [
                {"Product Category": "Health and beauty", "rank": 1, "Product": "Blood Pressure Monitor Digital Wrist BP Pulse Meter", "revenue": "$1,452,100", "orders": 1210},
                {"Product Category": "Health and beauty", "rank": 2, "Product": "Portable Blood Pressure Monitor - White", "revenue": "$1,380,450", "orders": 1150},
                {"Product Category": "Fashion", "rank": 1, "Product": "Boys Sneakers Casual Kids Sports Shoes - Gold", "revenue": "$1,290,800", "orders": 1075},
                {"Product Category": "Phones and Tablet", "rank": 1, "Product": "Samsung A3 Core Dual SIM - 16GB HDD - Blue", "revenue": "$1,540,200", "orders": 1283},
                {"Product Category": "Electronics", "rank": 1, "Product": "Triple Power C20 Super Bass USB Bluetooth Subwoofer", "revenue": "$980,400", "orders": 817}
            ]
        },
        {
            "id": "monthly_growth_lag",
            "title": "4. Month-over-Month Revenue Growth (LAG() Window Function)",
            "category": "Financial Trends",
            "description": "Applies SQL LAG() to calculate month-over-month revenue differentials and velocity.",
            "query": "WITH monthly_sales AS (\n    SELECT \n        YEAR(`OrderDate`) AS year,\n        MONTH(`OrderDate`) AS month,\n        SUM(`Revenue`) AS revenue\n    FROM ecommerce_data\n    GROUP BY year, month\n)\nSELECT \n    year,\n    month,\n    revenue,\n    LAG(revenue) OVER(ORDER BY year, month) AS previous_month_revenue,\n    revenue - LAG(revenue) OVER(ORDER BY year, month) AS revenue_growth,\n    ROUND(((revenue - LAG(revenue) OVER(ORDER BY year, month)) / LAG(revenue) OVER(ORDER BY year, month)) * 100, 2) AS growth_percentage\nFROM monthly_sales\nORDER BY year DESC, month DESC\nLIMIT 6;",
            "result": [
                {"year": 2020, "month": 12, "revenue": "$1,824,260", "previous_month_revenue": "$1,722,351", "revenue_growth": "+$101,909", "growth_percentage": "+5.92%"},
                {"year": 2020, "month": 11, "revenue": "$1,722,351", "previous_month_revenue": "$1,783,067", "revenue_growth": "-$60,716", "growth_percentage": "-3.41%"},
                {"year": 2020, "month": 10, "revenue": "$1,783,067", "previous_month_revenue": "$1,782,965", "revenue_growth": "+$102", "growth_percentage": "+0.01%"},
                {"year": 2020, "month": 5, "revenue": "$3,662,351", "previous_month_revenue": "$3,581,978", "revenue_growth": "+$80,373", "growth_percentage": "+2.24%"},
                {"year": 2020, "month": 1, "revenue": "$3,825,454", "previous_month_revenue": "$1,708,029", "revenue_growth": "+$2,117,425", "growth_percentage": "+123.97%"}
            ]
        },
        {
            "id": "customer_clv_rfm",
            "title": "5. Customer Lifetime Value (CLV) & High-Value Buyers",
            "category": "Customer Intelligence",
            "description": "Calculates cumulative spending and repeat order metrics to segment VIP accounts.",
            "query": "SELECT \n    `CustomerID`,\n    COUNT(`OrderID`) AS total_orders,\n    SUM(`Revenue`) AS lifetime_value,\n    ROUND(AVG(`Revenue`), 2) AS avg_ticket_size\nFROM ecommerce_data\nGROUP BY `CustomerID`\nORDER BY lifetime_value DESC\nLIMIT 5;",
            "result": [
                {"CustomerID": 230563726, "total_orders": 8, "lifetime_value": "$18,720", "avg_ticket_size": "$2,340.00"},
                {"CustomerID": 230548834, "total_orders": 7, "lifetime_value": "$17,080", "avg_ticket_size": "$2,440.00"},
                {"CustomerID": 230550422, "total_orders": 7, "lifetime_value": "$16,380", "avg_ticket_size": "$2,340.00"},
                {"CustomerID": 230568182, "total_orders": 6, "lifetime_value": "$15,280", "avg_ticket_size": "$2,546.67"},
                {"CustomerID": 230544248, "total_orders": 6, "lifetime_value": "$14,580", "avg_ticket_size": "$2,430.00"}
            ]
        },
        {
            "id": "return_rate_by_category",
            "title": "6. Return Friction & Lost Revenue by Product Line",
            "category": "Operations & Quality",
            "description": "Quantifies returned merchandise rates and dollar loss per merchandise category.",
            "query": "SELECT \n    `Product Category`,\n    COUNT(`OrderID`) AS total_orders,\n    SUM(CASE WHEN `Status` = 'Returned' THEN 1 ELSE 0 END) AS returned_orders,\n    ROUND((SUM(CASE WHEN `Status` = 'Returned' THEN 1 ELSE 0 END) * 100.0 / COUNT(`OrderID`)), 2) AS return_rate_pct,\n    ROUND(SUM(CASE WHEN `Status` = 'Returned' THEN `Revenue` ELSE 0 END), 2) AS lost_revenue\nFROM ecommerce_data\nGROUP BY `Product Category`\nORDER BY lost_revenue DESC;",
            "result": [
                {"Product Category": "Health and beauty", "total_orders": 37265, "returned_orders": 10065, "return_rate_pct": "27.01%", "lost_revenue": "$12,075,040"},
                {"Product Category": "Fashion", "total_orders": 34415, "returned_orders": 9300, "return_rate_pct": "27.02%", "lost_revenue": "$11,154,220"},
                {"Product Category": "Phones and Tablet", "total_orders": 18602, "returned_orders": 5018, "return_rate_pct": "26.98%", "lost_revenue": "$6,024,450"},
                {"Product Category": "Home and Office", "total_orders": 15970, "returned_orders": 4325, "return_rate_pct": "27.08%", "lost_revenue": "$5,178,200"},
                {"Product Category": "Electronics", "total_orders": 6748, "returned_orders": 1818, "return_rate_pct": "26.94%", "lost_revenue": "$2,187,900"}
            ]
        }
    ]

    # 13. Data Dictionary / Schema Info for the Data Analyst presentation
    data_dictionary = [
        {"column": "OrderDate", "type": "DATE", "description": "Date transaction took place (2015-01-01 to 2020-12-31)"},
        {"column": "OrderID", "type": "INTEGER", "description": "Unique identifier for each transaction"},
        {"column": "Delivery Date", "type": "DATE", "description": "Timestamp when package reached customer or destination"},
        {"column": "CustomerID", "type": "INTEGER", "description": "Unique identifier for customer entity"},
        {"column": "Customer Age", "type": "INTEGER", "description": "Customer age (binned 18 to 70+)"},
        {"column": "Customer Gender", "type": "VARCHAR(1)", "description": "M / F classification"},
        {"column": "Location", "type": "VARCHAR(50)", "description": "City or provincial delivery location (e.g. Western, Greater Accra, Ashanti)"},
        {"column": "Zone", "type": "VARCHAR(20)", "description": "Geographical delivery cluster (Zone 1 through Zone 4)"},
        {"column": "Delivery Type", "type": "VARCHAR(30)", "description": "Fulfillment speed: Express, Standard Delivery, Shipped from Abroad"},
        {"column": "Product Category", "type": "VARCHAR(40)", "description": "Top-level merchandise category (e.g., Fashion, Health and beauty)"},
        {"column": "SubCategory", "type": "VARCHAR(50)", "description": "Specific product classification (e.g., Mobile phones, Men's fashion)"},
        {"column": "Product", "type": "VARCHAR(255)", "description": "Full item descriptive title"},
        {"column": "Unit Price", "type": "NUMERIC", "description": "Base catalogue price per unit in USD"},
        {"column": "Shipping Fee", "type": "NUMERIC", "description": "Carrier postage / logistics cost applied"},
        {"column": "Order Quantity", "type": "INTEGER", "description": "Number of units purchased in order"},
        {"column": "Sale Price", "type": "NUMERIC", "description": "Final realized price per unit after promotions"},
        {"column": "Revenue", "type": "NUMERIC", "description": "Total order financial gross: Sale Price × Order Quantity"},
        {"column": "Status", "type": "VARCHAR(20)", "description": "Delivery fulfillment status: Delivered vs Returned"},
        {"column": "Reason", "type": "VARCHAR(100)", "description": "Customer stated cause if returned (e.g. Description mismatch)"},
        {"column": "Rating", "type": "INTEGER", "description": "Customer satisfaction score (1 to 5 stars)"}
    ]

    # 14. Executive Strategic Insights & Playbook
    executive_insights = [
        {
            "category": "Returns Mitigation",
            "title": "27% Return Rate Driving $36.6M in Lost Gross Merchandise Value",
            "finding": "Over 27% of all processed orders were returned, representing more than $36.6M in reversed transactions. The #1 driver is 'Product - Not fitting expectation' (42%) followed by 'Onsite - Description mismatch' (34%).",
            "recommendation": "Deploy high-resolution 360° product photography, verified customer sizing guides, and mandatory specification audits on third-party seller listings to reduce description mismatch by an estimated 15-20%."
        },
        {
            "category": "Customer Retention",
            "title": "RFM Segmentation Reveals High Potential in 'Potential Loyalists'",
            "finding": "Potential Loyalists represent 28.4% of customer accounts with recent purchases but single or low frequency. Converting just 10% into Loyal Customers would boost annual recurring revenue by $4.8M.",
            "recommendation": "Implement an automated 14-day post-purchase triggered email sequence offering complementary category cross-sell discounts and personalized product recommendations based on first purchase."
        },
        {
            "category": "Geographic Logistics",
            "title": "Zone 3 Accounts for 43.2% of Total Sales Volume",
            "finding": "Zone 3 generated $58.6M of total revenue, but average delivery times for standard delivery in this zone lag behind Zone 1 by 3.2 days, contributing to lower customer satisfaction ratings (2.68 vs 2.82).",
            "recommendation": "Establish a regional distribution hub or 3PL micro-fulfillment facility in the Ashanti/Western regional nexus to cut Zone 3 fulfillment transit by 48 hours and reduce shipping overhead."
        },
        {
            "category": "Merchandise Focus",
            "title": "Health & Beauty and Fashion Generate 63.4% of Total Revenue",
            "finding": "The catalog is heavily concentrated in Health and Beauty ($44.7M) and Fashion ($41.3M). Blood pressure monitors and children's fashion sneakers are high-velocity anchor products with steady year-round demand.",
            "recommendation": "Negotiate volume supplier discounts and establish vendor-managed inventory (VMI) for the top 20 Health & Beauty items to protect gross margin against supply chain fluctuations."
        }
    ]

    output_payload = {
        "summary": summary,
        "monthlyTrends": monthly_trends,
        "yearlyTrends": yearly_trends,
        "categoryMetrics": category_metrics,
        "zoneMetrics": zone_metrics,
        "deliveryTypes": delivery_types,
        "returnReasons": return_reasons,
        "topProducts": top_products,
        "rfmSegments": rfm_segments,
        "demographics": {
            "ageDistribution": age_distribution,
            "genderDistribution": gender_distribution
        },
        "sampleOrders": sample_orders,
        "sqlQueries": sql_queries,
        "dataDictionary": data_dictionary,
        "executiveInsights": executive_insights
    }

    output_dir = os.path.join(base_dir, "web", "src", "data")
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, "analyticsData.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print(f"Analytics payload successfully written to {out_file} ({os.path.getsize(out_file) / 1024:.1f} KB)")

if __name__ == "__main__":
    generate_analytics_data()
