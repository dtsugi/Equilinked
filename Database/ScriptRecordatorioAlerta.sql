-- Tabla para menejar las unidades de tiempo para el área personalizada
CREATE TABLE UnidadTiempo (
	ID INT IDENTITY NOT NULL,
	Descripcion VARCHAR(255),
	EquivalenciaMinutos INT NOT NULL
)
GO

ALTER TABLE UnidadTiempo ADD CONSTRAINT PK_UnidadTiempo PRIMARY KEY(ID)
GO

INSERT INTO UnidadTiempo(Descripcion, EquivalenciaMinutos) VALUES('Minuto(s)', 1)
GO

INSERT INTO UnidadTiempo(Descripcion, EquivalenciaMinutos) VALUES('Hora(s)', 60)
GO

INSERT INTO UnidadTiempo(Descripcion, EquivalenciaMinutos) VALUES('Día(s)', 1440)
GO

-- Tabla con las "plantillas" prestablecidas de opciones para mostrar 
CREATE TABLE Recordatorio (
	ID INT IDENTITY NOT NULL,
	Descripcion VARCHAR(255) NOT NULL,
	ValorTiempo INT,
	UnidadTiempo_ID INT,
)

ALTER TABLE Recordatorio ADD CONSTRAINT PK_Recordatorio PRIMARY KEY(ID)
GO

ALTER TABLE Recordatorio
ADD CONSTRAINT FK_Recordatorio_UnidadTiempo_ID FOREIGN KEY(UnidadTiempo_ID)
REFERENCES UnidadTiempo(ID)
GO

INSERT INTO Recordatorio(Descripcion, ValorTiempo, UnidadTiempo_ID) VALUES('30 Minuto(s)', 30, 1)
GO

INSERT INTO Recordatorio(Descripcion, ValorTiempo, UnidadTiempo_ID) VALUES('1 Hora(s)', 1, 2)
GO

INSERT INTO Recordatorio(Descripcion, ValorTiempo, UnidadTiempo_ID) VALUES('1 Día(s)', 1, 3)
GO

INSERT INTO Recordatorio(Descripcion) VALUES('Personalizar')
GO

-- Tabla para guardar los recordatorios por alerta
CREATE TABLE AlertaRecordatorio (
	ID INT IDENTITY NOT NULL,
	Alerta_ID INT NOT NULL,
	ValorTiempo INT NOT NULL,
	UnidadTiempo_ID INT NOT NULL,
)
GO

ALTER TABLE AlertaRecordatorio ADD CONSTRAINT PK_AlertaRecordatorio PRIMARY KEY(ID)
GO

ALTER TABLE AlertaRecordatorio
ADD CONSTRAINT FK_AlertaRecordatorio_UnidadTiempo_ID FOREIGN KEY(UnidadTiempo_ID)
REFERENCES UnidadTiempo(ID)
GO

ALTER TABLE AlertaRecordatorio
ADD CONSTRAINT FK_AlertaRecordatorio_Alerta_ID FOREIGN KEY(Alerta_ID)
REFERENCES Alerta(ID)
GO

ALTER TABLE Alerta ADD FechaFinal DATETIME
GO

ALTER TABLE Alerta ADD Resultado TEXT
GO

ALTER TABLE Alerta ADD Propietario_ID INT
GO

ALTER TABLE Alerta
ADD CONSTRAINT FK_Alerta_Propietario_ID FOREIGN KEY(Propietario_ID)
REFERENCES Propietario(ID)
GO

