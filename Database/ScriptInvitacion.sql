CREATE TABLE InvitacionAmigo (
	ID INT IDENTITY NOT NULL,
	Propietario_ID INT NOT NULL,
	CorreoDestinatario VARCHAR(255) NOT NULL,
	Mensaje TEXT NOT NULL,
	FechaEnvio DATETIME NOT NULL
)
GO

ALTER TABLE InvitacionAmigo ADD CONSTRAINT PK_InvitacionAmigo PRIMARY KEY(ID)
GO

ALTER TABLE InvitacionAmigo
ADD CONSTRAINT FK_InvitacionAmigo_Propietario_ID FOREIGN KEY(Propietario_ID)
REFERENCES Propietario(ID)
GO


CREATE TABLE ConfiguracionCorreo (
	ID INT IDENTITY NOT NULL,
	Correo VARCHAR(255) NOT NULL,
	Contrasena VARCHAR(255) NOT NULL,
	Host VARCHAR(255) NOT NULL,
	Puerto VARCHAR(255) NOT NULL,
	EnableSsl BIT NOT NULL,
	UseDefaultCredentials BIT NOT NULL
)
GO

ALTER TABLE ConfiguracionCorreo ADD CONSTRAINT PK_ConfiguracionCorreo PRIMARY KEY(ID)
GO

CREATE TABLE PlantillaCorreo (
	ID INT IDENTITY NOT NULL,
	Asunto TEXT NOT NULL,
	Contenido TEXT NOT NULL,
	ConfiguracionCorreo_ID INT NOT NULL
)
GO

ALTER TABLE PlantillaCorreo ADD CONSTRAINT PK_PlantillaCorreo PRIMARY KEY(ID)
GO

ALTER TABLE PlantillaCorreo
ADD CONSTRAINT FK_PlantillaCorreo_ConfiguracionCorreo_ID FOREIGN KEY(ConfiguracionCorreo_ID)
REFERENCES ConfiguracionCorreo(ID)
GO

