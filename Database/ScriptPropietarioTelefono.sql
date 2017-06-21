CREATE TABLE PropietarioTelefono (
	ID INT IDENTITY NOT NULL,
	Propietario_ID INT NOT NULL,
	Numero VARCHAR(255) NOT NULL,
	TipoNumero_ID INT NOT NULL
)
GO

ALTER TABLE PropietarioTelefono
ADD CONSTRAINT PK_PropietarioTelefono PRIMARY KEY(ID)
GO

ALTER TABLE PropietarioTelefono 
ADD CONSTRAINT FK_PropietarioTelefono_Propietario_ID 
FOREIGN KEY(Propietario_ID) REFERENCES Propietario(ID)
GO

ALTER TABLE PropietarioTelefono 
ADD CONSTRAINT FK_PropietarioTelefono_TipoNumero_ID 
FOREIGN KEY(TipoNumero_ID) REFERENCES Tipo_Numero(ID)
GO