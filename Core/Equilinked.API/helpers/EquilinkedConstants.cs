
namespace Equilinked.API.helpers
{
    public static class EquilinkedConstants
    {
        #region Errors Messages

        public const string ERR_NOT_FOUND_ELEM = "No se encontró el elemento especificado";
        public const string ERR_WITHOUT_DATA = "No se encontraron registros";
        public const string MSG_ERROR_GENERAL = "Hubo un error en el sistema, comúniquese con el administrador del sistema para más información";        

        #endregion

        #region Successful Messages

        public const string MSG_SUCCESSFUL_TITLE = "Operación exitosa";
        public const string MSG_SUCCESSFUL_CREATE = "El registro se insertó correctamente";
        public const string MSG_SUCCESSFUL_UPDATE = "El registro se actualizó correctamente";
        public const string MSG_SUCCESSFUL_DELETE = "El registro se eliminó correctamente";
        public const string MSG_SUCCESSFUL_REACTIVATION = "El registro se reactivó correctamente";

        #endregion

        #region Error Messages

        public const string MSG_ERROR_TITLE = "Ocurrió un error";
        public const string MSG_ERROR_SELECT = "No se encontraron registros (ERR_SELECT)";
        public const string MSG_ERROR_CREATE = "Error insertando el registro";
        public const string MSG_ERROR_UPDATE = "Error modificando el registro";
        public const string MSG_ERROR_DELETE = "Error eliminando el registro";
        public const string MSG_ERROR_REACTIVATION = "Error reactivando el registro";
        public const string MSG_ERROR_MAIL_SEND = "Error en el envío de mail";

        #endregion
    }
}
