CREATE PROCEDURE ValidarGrupoDefaultPropietario @PropietarioId INT
AS BEGIN
	DECLARE @GrupoDefault INT;
	DECLARE @GrupoId INT;
	DECLARE @CaballosSinGrupo INT;
	
	-- Buscamos si ya tiene grupo <Todos mis caballos>
	SELECT @GrupoDefault = ID FROM Grupo WHERE GrupoDefault = 1 AND Propietario_ID = @PropietarioId;
	
	IF @GrupoDefault IS NULL
		BEGIN
			
			-- Creamos el grupo
			INSERT INTO Grupo(Descripcion, Propietario_ID, GrupoDefault)  
			VALUES('Todos mis caballos', @PropietarioId, 1);
			
			--Obtemos el id de la insercion
			SET @GrupoId = Scope_Identity();
			
			--Insertamos los caballos al grupo
			INSERT INTO GrupoCaballo(Grupo_ID, Caballo_ID) 
			SELECT @GrupoId, ID FROM CABALLO
			WHERE Propietario_ID = @PropietarioId;
		END
	ELSE 
		BEGIN
			-- Insertamos los ids de los caballos que no se encuetren en GrupoCaballo (En teoria deberia ser siempre 1)
			INSERT INTO GrupoCaballo(Grupo_ID, Caballo_ID)
			SELECT @GrupoDefault, C.ID FROM (
				SELECT ID FROM Caballo WHERE Propietario_ID = @PropietarioId
			) AS C LEFT JOIN (
				SELECT GC.Caballo_ID FROM GrupoCaballo AS GC
				INNER JOIN Grupo AS G ON G.ID = GC.Grupo_ID
				WHERE G.Propietario_ID = @PropietarioId AND G.GrupoDefault = 1
			) AS CG ON CG.Caballo_ID = C.ID
			WHERE CG.Caballo_ID IS NULL
		END
END;
GO