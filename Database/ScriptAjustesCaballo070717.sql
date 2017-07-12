-- Tabla de catalogos de protectores para caballo
CREATE TABLE Protector(
	ID INT IDENTITY NOT NULL,
	Descripcion VARCHAR(255) NOT NULL
)
GO

ALTER TABLE Protector ADD CONSTRAINT PK_Protector PRIMARY KEY(ID)
GO


-- tabla 1 a 1 para guardar responsable de caballo
CREATE TABLE ResponsableCaballo (
	Caballo_ID INT NOT NULL,
	Nombre VARCHAR(255),
	Telefono VARCHAR(255),
	CorreoElectronico VARCHAR(255)
)
GO

ALTER TABLE ResponsableCaballo ADD CONSTRAINT PK_ResponsableCaballo PRIMARY KEY(Caballo_ID)
GO

ALTER TABLE ResponsableCaballo 
ADD CONSTRAINT FK_ResponsableCaballo_Caballo_ID
FOREIGN KEY(Caballo_ID) REFERENCES Caballo(ID)
GO


-- Tabla 1 a 1 con caballo para guardar pedigree
CREATE TABLE GenealogiaCaballo (
	Caballo_ID INT NOT NULL,
	Madre VARCHAR(255),
	Padre VARCHAR(255)
)
GO

ALTER TABLE GenealogiaCaballo ADD CONSTRAINT PK_GenealogiaCaballo PRIMARY KEY(Caballo_ID)
GO

ALTER TABLE GenealogiaCaballo 
ADD CONSTRAINT FK_GenealogiaCaballo_Caballo_ID
FOREIGN KEY(Caballo_ID) REFERENCES Caballo(ID)
GO

-- Tabla de 1 a 1 con caballo para guardar su criador
CREATE TABLE CriadorCaballo (
	Caballo_ID INT NOT NULL,
	Nombre VARCHAR(255),
	Pais_ID INT
)
GO

ALTER TABLE CriadorCaballo ADD CONSTRAINT PK_CriadorCaballo PRIMARY KEY(Caballo_ID)
GO

ALTER TABLE CriadorCaballo 
ADD CONSTRAINT FK_CriadorCaballo_Caballo_ID
FOREIGN KEY(Caballo_ID) REFERENCES Caballo(ID)
GO

ALTER TABLE CriadorCaballo 
ADD CONSTRAINT FK_CriadorCaballo_Pais_ID
FOREIGN KEY(Pais_ID) REFERENCES Pais(ID)
GO

-- Campos que faltan en caballo
ALTER TABLE Caballo ADD NombrePropietario VARCHAR(255)
GO

ALTER TABLE Caballo ADD Marcas VARCHAR(255)
GO

ALTER TABLE Caballo ADD Protector_ID INT
GO

ALTER TABLE Caballo 
ADD CONSTRAINT FK_Caballo_Protector_ID
FOREIGN KEY(Protector_ID) REFERENCES Protector(ID)
GO

-- No soportaban algunas lineas de informacion estaban como varchar
ALTER TABLE Alimentacion ALTER COLUMN Solido TEXT
GO

ALTER TABLE Alimentacion ALTER COLUMN SuplementoSDietarios TEXT
GO

ALTER TABLE Alimentacion ALTER COLUMN Pasto TEXT
GO

-- Campos que ya no serán utiles
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.Criador_Criador_ID";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.Establecimiento_Establecimiento_ID";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.EstadoProvincia_EstadoProvincia_Id";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.Grupo_Grupo_ID";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.OtrasMarcas_OtrasMarcas_ID";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.Pedigree_Pedigree_ID";
alter table Caballo DROP constraint "FK_dbo.Caballo_dbo.PersonaACargo_PersonaACargo_ID";

/*
ALTER TABLE Caballo DROP COLUMN Protector
GO
ALTER TABLE Caballo DROP COLUMN Criador_ID
GO
ALTER TABLE Caballo DROP COLUMN Establecimiento_ID
GO
ALTER TABLE Caballo DROP COLUMN EstadoProvincia_ID
GO
ALTER TABLE Caballo DROP COLUMN Grupo_ID
GO
ALTER TABLE Caballo DROP COLUMN OtrasMarcas_ID
GO
ALTER TABLE Caballo DROP COLUMN Pedigree_ID
GO

Nota: Eliminar tablas que tienen que ver con esas relaciones
*/