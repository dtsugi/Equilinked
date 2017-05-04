CREATE TABLE dbo.Alimentacion
(
	ID INT IDENTITY NOT NULL,
	Solido VARCHAR(200) NULL,
	SuplementosDietarios VARCHAR(200) NULL,
	Pasto VARCHAR(200) NULL,
	Caballo_ID INT NOT NULL
)
GO

ALTER TABLE dbo.Alimentacion
ADD CONSTRAINT PK_Alimentacion PRIMARY KEY(ID)
GO

ALTER TABLE dbo.Alimentacion
ADD CONSTRAINT PK_Alimentacion_Caballo FOREIGN KEY(Caballo_ID)
REFERENCES dbo.Caballo(ID)
GO