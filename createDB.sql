USE WebChat
DROP USER WebChat;
DROP LOGIN WebChat;
USE master
DROP DATABASE WebChat;
GO
CREATE DATABASE WebChat;
GO
USE WebChat;
CREATE LOGIN WebChat 
WITH PASSWORD = 'WebChat', 
CHECK_POLICY = OFF, 
DEFAULT_DATABASE = WebChat;
GO
CREATE USER WebChat FOR LOGIN WebChat;
GO
ALTER ROLE db_datareader ADD MEMBER WebChat;
ALTER ROLE db_datawriter ADD MEMBER WebChat;
GO
CREATE TABLE Posts (
	id INTEGER PRIMARY KEY IDENTITY(1, 1),
	name NVARCHAR(MAX),
	type NVARCHAR(MAX),
	time NUMERIC(19),
	post NVARCHAR(MAX)
);
GO
INSERT INTO Posts
VALUES 
	('Marc', 'join', 1608850130113, NULL),
	('Marc', 'post', 1608850130114, '#############################################################'),
	('Marc', 'post', 1608850130115, 'Welcome to the CIS 195N Web Chat Server!'),
	('Marc', 'post', 1608850130116, 'This database is only meant for use in CIS 195N, for testing purposes.'),
	('Marc', 'post', 1608850130117, 'Please contact a CIS 195N instructor if you have any questions or concerns.'),
	('Marc', 'post', 1608850130118, '#############################################################'),
	('Marc', 'leave', 1608850130119, NULL);
GO

