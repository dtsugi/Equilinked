CREATE TABLE MotivoContacto (
	ID INT IDENTITY NOT NULL,
	Descripcion VARCHAR(255) NOT NULL,
)
GO

ALTER TABLE MotivoContacto ADD CONSTRAINT PK_MotivoContacto PRIMARY KEY(ID)
GO

CREATE TABLE MensajeContacto (
	ID INT IDENTITY NOT NULL,
	MotivoContacto_ID INT NOT NULL,
	Mensaje TEXT NOT NULL,
	Fecha DATETIME NOT NULL,
	Propietario_ID INT NOT NULL
)
GO

ALTER TABLE MensajeContacto ADD CONSTRAINT PK_MensajeContacto PRIMARY KEY(ID)
GO

ALTER TABLE MensajeContacto
ADD CONSTRAINT FK_MensajeContacto_MotivoContacto_ID FOREIGN KEY(MotivoContacto_ID)
REFERENCES MotivoContacto(ID)
GO

ALTER TABLE MensajeContacto
ADD CONSTRAINT FK_MensajeContacto_Propietario_ID FOREIGN KEY(Propietario_ID)
REFERENCES Propietario(ID)
GO

INSERT INTO MotivoContacto(Descripcion) VALUES('Reportar falla')
INSERT INTO MotivoContacto(Descripcion) VALUES('Sugerencias')
INSERT INTO MotivoContacto(Descripcion) VALUES('Otro')
GO