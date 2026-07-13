-- Stock price movement history is now stored in MongoDB collection:
-- stock_price_histories
--
-- MySQL keeps only relational/accounting data:
-- users, wallets, portfolio holdings, transactions, stock master/current price.
--
-- Run this against the MySQL database after deploying the Mongo document/repository code.
-- It removes the old relational history table that is no longer managed by JPA.

DROP TABLE IF EXISTS stock_price_histories;
