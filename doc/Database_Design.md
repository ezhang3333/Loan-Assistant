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