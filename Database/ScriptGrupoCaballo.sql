
CREATE TABLE GrupoCaballo(
	ID INT IDENTITY NOT NULL,
	Grupo_ID INT NOT NULL,
	Caballo_ID INT NOT NULL
);
GO

ALTER TABLE GrupoCaballo ADD CONSTRAINT PK_GrupoCaballo PRIMARY KEY(ID);
GO

ALTER TABLE GrupoCaballo ADD CONSTRAINT FK_GrupoCaballo_Grupo_ID FOREIGN KEY(Grupo_ID) REFERENCES GRUPO(ID);
GO

ALTER TABLE GrupoCaballo ADD CONSTRAINT FK_GrupoCaballo_Caballo_ID FOREIGN KEY(Caballo_ID) REFERENCES CABALLO(ID);
GO


ALTER TABLE Grupo ADD Propietario_ID INT;
GO

ALTER TABLE Grupo ADD CONSTRAINT FK_Grupo_Propietario_ID FOREIGN KEY(Propietario_ID) REFERENCES Propietario(ID);
GO