CREATE TABLE Establo (
	ID INT IDENTITY NOT NULL,
	Nombre VARCHAR(255) NOT NULL,
	Manager VARCHAR(255) NOT NULL,
	CorreoElectronico VARCHAR(255) NOT NULL,
	Telefono VARCHAR(255) NOT NULL,
	Direccion VARCHAR(255) NOT NULL,
	Propietario_ID INT NOT NULL
)
GO

ALTER TABLE Establo ADD CONSTRAINT PK_Establo PRIMARY KEY(ID)
GO

ALTER TABLE Establo
ADD CONSTRAINT FK_Establo_Propietario_ID FOREIGN KEY(Propietario_ID)
REFERENCES Propietario(ID)
GO

CREATE TABLE EstabloCaballo (
	ID INT IDENTITY NOT NULL,
	Establo_ID INT NOT NULL,
	Caballo_ID INT NOT NULL
)
GO

ALTER TABLE EstabloCaballo 
ADD CONSTRAINT PK_EstabloCaballo 
PRIMARY KEY(ID);
GO

ALTER TABLE EstabloCaballo 
ADD CONSTRAINT FK_EstabloCaballo_Establo_ID 
FOREIGN KEY(Establo_ID) REFERENCES Establo(ID);
GO

ALTER TABLE EstabloCaballo 
ADD CONSTRAINT FK_EstabloCaballo_Caballo_ID 
FOREIGN KEY(Caballo_ID) REFERENCES Caballo(ID);
GO