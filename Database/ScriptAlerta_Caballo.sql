CREATE TABLE dbo.AlertaCaballo
(
	ID int IDENTITY NOT NULL,
	Alerta_ID int NOT NULL,
	Caballo_ID int NOT NULL
)
GO

ALTER TABLE AlertaCaballo
ADD CONSTRAINT PK_AlertaCaballo PRIMARY KEY (ID)
GO

ALTER TABLE AlertaCaballo
ADD CONSTRAINT FK_AlertaCaballo_Alerta FOREIGN KEY (Alerta_ID)
REFERENCES dbo.Alerta (ID)
GO

ALTER TABLE AlertaCaballo
ADD CONSTRAINT FK_AlertaCaballo_Caballo FOREIGN KEY (Caballo_ID)
REFERENCES dbo.Caballo (ID)
GO

