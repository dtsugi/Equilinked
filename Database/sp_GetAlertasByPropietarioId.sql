ALTER PROCEDURE sp_GetAlertasByPropietarioId
	@PROPIETARIO_ID INT	
AS
BEGIN

	select 
		A.ID,
		A.Titulo,
		A.FechaNotificacion,
		A.HoraNotificacion,
		A.Tipo,
		A.Activa,
		A.Descripcion	,	
		DATEDIFF(day,A.FechaNotificacion,GETDATE()) AS DiffEnDias
	from dbo.Caballo C
	INNER JOIN dbo.AlertaCaballo AC
	ON C.ID = AC.Caballo_ID
	INNER JOIN dbo.Alerta A
	ON AC.Alerta_ID = A.ID
	WHERE C.Propietario_ID = @PROPIETARIO_ID
END