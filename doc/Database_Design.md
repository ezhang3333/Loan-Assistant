Create Commands:

1. Loans:

CREATE TABLE Loan (
    loan_id INT PRIMARY KEY,
    amount DECIMAL(10, 2),
    term INT,
    subgrade VARCHAR(5),
    installments DECIMAL(10, 2),
    purpose VARCHAR(50),
    loan_type VARCHAR(20),
    loan_state VARCHAR(20)
);

2. Banks:

CREATE TABLE Bank (
    bank_id INT PRIMARY KEY,
    name VARCHAR(100),
    zipcode INT,
    type VARCHAR(20)
);

3. Location:

CREATE TABLE Location (
    zipcode INT PRIMARY KEY,
    state VARCHAR(2),
    medium_house_income INT,
    avg_num_kids DECIMAL(3, 2),
    crime_rate DECIMAL(4, 2),
    employment_rate DECIMAL(5, 2),
    avg_credit_score INT
);

4. User:

CREATE TABLE User (
    user_id INT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    gender VARCHAR(10),
    marital_status VARCHAR(20),
    annual_income DECIMAL(12, 2),
    credit_score INT,
    num_loans_taken INT,
    age INT,
    employment_status VARCHAR(30),
    num_existing_loans INT,
    zipcode INT,
    loan_amount_asked DECIMAL(10, 2)
);

5. Simulations:

CREATE TABLE Simulations (
    simulation_id INT PRIMARY KEY,
    user_id INT,
    created_date DATE,
    eval_score DECIMAL(5, 2)
);

Advanced SQL Queries:

1. Number of banks, average household income, and average credit score per state

SELECT l.state, COUNT(b.bank_id) AS num_banks, 
       AVG(l.medium_house_income) AS avg_income,
       AVG(l.avg_credit_score) AS avg_credit
FROM Bank b
JOIN Location l ON b.zipcode = l.zipcode
GROUP BY l.state
ORDER BY num_banks DESC
LIMIT 15;

2. Loan purposes where individual loan amounts exceed the overall average, grouped by purpose

SELECT purpose, AVG(amount) AS avg_amount, COUNT(*) AS num_loans
FROM Loan
WHERE amount > (SELECT AVG(amount) FROM Loan)
GROUP BY purpose
ORDER BY avg_amount DESC
LIMIT 15;

3. Banks located in areas with above-average credit scores, ranked by credit score

SELECT b.name, b.type, l.state, l.avg_credit_score
FROM Bank b
JOIN Location l ON b.zipcode = l.zipcode
WHERE l.avg_credit_score > (SELECT AVG(avg_credit_score) FROM Location)
ORDER BY l.avg_credit_score DESC
LIMIT 15;


Part 2 Indexing:

Explain Analyze

Advanced Query 1: 
Limit: 15 row(s) (actual time=3.2..3.2 rows=15 loops=1) -> Sort: num_banks DESC, limit input to 15 row(s) per chunk (actual time=3.2..3.2 rows=15 loops=1) -> Table scan on <temporary> (actual time=3.18..3.19 rows=52 loops=1) -> Aggregate using temporary table (actual time=3.18..3.18 rows=52 loops=1) -> Nested loop inner join (cost=568 rows=1258) (actual time=0.0538..2.31 rows=1258 loops=1) -> Filter: (b.zipcode is not null) (cost=128 rows=1258) (actual time=0.0426..0.38 rows=1258 loops=1) -> Table scan on b (cost=128 rows=1258) (actual time=0.0421..0.313 rows=1258 loops=1) -> Single-row index lookup on l using PRIMARY (zipcode=b.zipcode) (cost=0.25 rows=1) (actual time=0.00138..0.0014 rows=1 loops=1258)

Advanced Query 2:
Limit: 15 row(s) (actual time=31.4..31.4 rows=14 loops=1) -> Sort: avg_amount DESC, limit input to 15 row(s) per chunk (actual time=31.4..31.4 rows=14 loops=1) -> Table scan on <temporary> (actual time=31.4..31.4 rows=14 loops=1) -> Aggregate using temporary table (actual time=31.4..31.4 rows=14 loops=1) -> Filter: (Loan.amount > (select #2)) (cost=1497 rows=13125) (actual time=10.2..23.1 rows=16188 loops=1) -> Table scan on Loan (cost=1497 rows=39380) (actual time=0.184..8.95 rows=39718 loops=1) -> Select #2 (subquery in condition; run only once) -> Aggregate: avg(Loan.amount) (cost=8060 rows=1) (actual time=9.98..9.98 rows=1 loops=1) -> Table scan on Loan (cost=4122 rows=39380) (actual time=0.691..6.82 rows=39718 loops=1)

Advanced Query 3:
Limit: 15 row(s) (actual time=2.91..2.91 rows=15 loops=1) -> Sort: l.avg_credit_score DESC, limit input to 15 row(s) per chunk (actual time=2.91..2.91 rows=15 loops=1) -> Stream results (cost=568 rows=419) (actual time=0.354..2.82 rows=661 loops=1) -> Nested loop inner join (cost=568 rows=419) (actual time=0.351..2.64 rows=661 loops=1) -> Filter: (b.zipcode is not null) (cost=128 rows=1258) (actual time=0.0551..0.412 rows=1258 loops=1) -> Table scan on b (cost=128 rows=1258) (actual time=0.0545..0.346 rows=1258 loops=1) -> Filter: (l.avg_credit_score > (select #2)) (cost=0.25 rows=0.333) (actual time=0.00164..0.00168 rows=0.525 loops=1258) -> Single-row index lookup on l using PRIMARY (zipcode=b.zipcode) (cost=0.25 rows=1) (actual time=0.00124..0.00126 rows=1 loops=1258) -> Select #2 (subquery in condition; run only once) -> Aggregate: avg(Location.avg_credit_score) (cost=243 rows=1) (actual time=0.274..0.274 rows=1 loops=1) -> Table scan on Location (cost=122 rows=1209) (actual time=0.016..0.178 rows=1209 loops=1)

Exploring Tradeoffs of Different Indices:

Query 1 Indexing:
1. CREATE INDEX idx_bank_zipcode ON Bank(zipcode);

We added an index on the zipcode attribute for the bank entity. We wanted to observe the performance changes because on JOIN zipcode is used to connect and link the bank and location tables. We observed no changes in the cost when compared to the baseline for advanced query 1. 

2. CREATE INDEX idx_location_state ON Location(state);

We added index on the state attribute within the location entity because it is used within the GROUP BY clause. We noticed no changes in the cost between the baseline and adding the index for the state attribute in the location table

3. CREATE INDEX idx_location_state ON Location(state);
CREATE INDEX idx_bank_zipcode ON Bank(zipcode);

The third design for the advanced query we decided to try and add indexing by combining both design 1 and design 2. Because both the state and zipcode attributes are in a GROUP BY and JOIN clause respectfully, testing out its index made sense. We noticed no changes in the cost with this third index design. 

Query 2 Indexing:
1. CREATE INDEX idx_loan_amount ON Loan(amount);

Cost went up from 1497 to 4122. We added index on the attribute for amount because it is used in the WHERE clause. The performance ending up degrading from the original baseline. 

2. CREATE INDEX idx_loan_purpose ON Loan(purpose);

Cost stayes the same. We added index on the on the purpose attribute because it is in the GROUP BY attribute. The performance ending up staying the same with not improvment or degradation. 

3. CREATE INDEX idx_loan_amount ON Loan(amount);
CREATE INDEX idx_loan_purpose ON Loan(purpose);

Cost went up to 4122 with a higher cost than the baseline. We decided to combine both the first and second index designs and the performance ended up degrading and becoming worse than the baseline. 

Query 3 Indexing: 
1. CREATE INDEX idx_bank_zipcode ON Bank(zipcode);

Cost improved and dropped from 568 to 392. We decided to add index on the zipcode attribute from the Bank table because it is used in the join clause within the advanced query. We saw a performance gain as a result of this indexing. 

2. CREATE INDEX idx_location_credit ON Location(avg_credit_score);

Cost stayed the same as the baseline. We decided to add an index to the avg_credit_score attribute in the location index because it is in the WHERE clause and the ORDER BY clause within the advanced query. We saw that the cost did not change from the baseline and stayed the same. 

3. CREATE INDEX idx_bank_zipcode ON Bank(zipcode);
CREATE INDEX idx_location_credit ON Location(avg_credit_score);

Cost dropped from 568 to 458. Our third index design was to combine both the first and second index designs and the result was a performance gain. The performance improved but it did not improve by as much as index design 1. 

Final Index Design:
Query 1: No additional indexes. We decided to keep the index design as the same as the baseline, which did not have any additional indexes. We came to this decision because from the three index designs we tried we did not see any improvement in performance. 

Query 2: No additional indexes. We decided to keep the index design as the same as the baseline, which did not have any additional indexes. We came to this decision because from the three index designs we tried we did not see any improvement in performance. 

Query 3: The final index design includes adding a index on the zipcode attribute within the bank table. We decided to only add this index because it showed the most improvement from the three index design we tried. Even though another design had a performance improvement since it included the zipcode index, we cannot include it in the final design because the perfomance gain was not as much as the index on the zipcode attribute by itself. 

Why some Index Designs did not result in improvement:
Some index designs did not result in improvement because adding indexes did not change performance or improve efficiency. This could be because adding these indexes did not change how certain attributes were calculated or measured in those queries. 