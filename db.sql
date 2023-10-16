-- Active: 1697462998028@@147.139.210.135@5432@arif04

CREATE TABLE balance (
    id serial PRIMARY KEY,
    user_id bigint NOT NULL DEFAULT 0,
    amount_available numeric(10, 0) NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    updated_at timestamp NOT NULL DEFAULT current_timestamp
);

INSERT INTO balance VALUES (1, 1, 0, '2022-03-07 09:57:13'::timestamp, '2022-03-07 09:57:13'::timestamp);
INSERT INTO balance VALUES (2, 2, 1, '2022-03-07 09:57:13'::timestamp, '2022-03-07 09:57:13'::timestamp);
INSERT INTO balance VALUES (3, 3, 0, '2022-03-07 09:57:13'::timestamp, '2022-03-07 09:57:13'::timestamp);
INSERT INTO balance VALUES (4, 4, 21, '2022-03-07 09:57:13'::timestamp, '2022-03-07 09:57:13'::timestamp);

CREATE TABLE transaction (
    id serial PRIMARY KEY,
    trx_id varchar(255) NOT NULL DEFAULT '',
    user_id bigint NOT NULL DEFAULT 0,
    amount decimal(10, 0) NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    updated_at timestamp NOT NULL DEFAULT current_timestamp
);

INSERT INTO transaction VALUES (1, 'a', 1, 0, '2022-03-07 09:55:44', '2022-03-07 09:55:44');
INSERT INTO transaction VALUES (2, 'B', 1, 0, '2022-03-07 09:55:44', '2022-03-07 09:55:44');

CREATE TABLE users (
    id serial PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT
    b.user_id,
    u.username,
    b.amount_available as balance,
    json_agg(json_build_object('trx_id', t.trx_id, 'amount', t.amount)) AS transactions
FROM
    balance AS b
JOIN
    users AS u ON b.user_id = u.id
LEFT JOIN
    transaction AS t ON b.user_id = t.user_id
GROUP BY
    b.user_id, u.username, b.amount_available;


