INSERT INTO public."Users"
(id, "name", email, "password", "createdAt", "updatedAt")
VALUES(1, 'userName', 'user@mail.com', '$2b$10$OERz2OCo6t6vLC4GEZXmN.KqEkkN/lCuy4sx1Kl6NLMNvKO2E2euK', '2025-11-17 14:16:01.320', '2025-11-17 14:16:01.320');

INSERT INTO public."Accounts"
(id, "userId", balance, "type", "createdAt", "updatedAt")
VALUES(1, 1, 500.00, 'checking', '2025-11-17 14:16:01.325', '2025-11-17 14:16:01.325');

INSERT INTO public."Transactions"
(id, "accountId", "type", amount, description, "createdAt", "updatedAt")
VALUES(1, 1, 'credit', 200.00, 'Salary', '2025-10-15 02:00:00.000', '2025-11-17 14:16:01.329');
INSERT INTO public."Transactions"
(id, "accountId", "type", amount, description, "createdAt", "updatedAt")
VALUES(2, 1, 'debit', 50.00, 'Groceries', '2025-10-16 02:00:00.000', '2025-11-17 14:16:01.329');
INSERT INTO public."Transactions"
(id, "accountId", "type", amount, description, "createdAt", "updatedAt")
VALUES(3, 1, 'debit', 20.00, 'Transport', '2025-10-17 02:00:00.000', '2025-11-17 14:16:01.329');
INSERT INTO public."Transactions"
(id, "accountId", "type", amount, description, "createdAt", "updatedAt")
VALUES(4, 1, 'credit', 100.00, 'Friend transfer', '2025-10-17 02:00:00.000', '2025-11-17 14:16:01.329');