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

-- Tablas para almacenar informacion del establo como telefonos y correos

CREATE TABLE EstabloTelefono (
	ID INT IDENTITY NOT NULL,
	Numero VARCHAR(255) NOT NULL,
	Tipo_Numero_ID INT NOT NULL,
	Establo_ID INT NOT NULL
)
GO

ALTER TABLE EstabloTelefono 
ADD CONSTRAINT PK_EstabloTelefono
PRIMARY KEY(ID);
GO

ALTER TABLE EstabloTelefono 
ADD CONSTRAINT FK_EstabloTelefono_Establo_ID 
FOREIGN KEY(Establo_ID) REFERENCES Establo(ID);
GO

ALTER TABLE EstabloTelefono 
ADD CONSTRAINT FK_EstabloTelefono_Tipo_Numero_ID 
FOREIGN KEY(Tipo_Numero_ID) REFERENCES Tipo_Numero(ID);
GO

CREATE TABLE EstabloCorreo (
	ID INT IDENTITY NOT NULL,
	CorreoElectronico VARCHAR(255) NOT NULL,
	Establo_ID INT NOT NULL
)
GO

ALTER TABLE EstabloCorreo 
ADD CONSTRAINT PK_EstabloCorreo
PRIMARY KEY(ID);
GO


ALTER TABLE EstabloCorreo 
ADD CONSTRAINT FK_EstabloCorreo_Establo_ID 
FOREIGN KEY(Establo_ID) REFERENCES Establo(ID);
GO

ALTER TABLE Establo DROP COLUMN Telefono;
ALTER TABLE Establo DROP COLUMN CorreoElectronico

-- Nueva columna a caballo para referenciarlo a un solo estbalo
ALTER TABLE Caballo ADD Establo_ID INT
GO

ALTER TABLE Caballo 
ADD CONSTRAINT FK_Caballo_Establo_ID 
FOREIGN KEY(Establo_ID) REFERENCES Establo(ID)
GO
