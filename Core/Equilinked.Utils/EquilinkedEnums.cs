namespace Equilinked.Utils
{
    public class EquilinkedEnums
    {
        public enum OrdenamientoEnum
        {
            ASCENDENTE = 1,
            DESCENDENTE = 2
        }

        public enum TipoAlertasEnum
        {
            HERRAJE = 1,
            DESPARACITACION = 2,
            EVENTOS = 3,
            DENTISTA = 4,
            NOTASVARIAS = 5
        }

        public enum FilterAlertaEnum
        {
            ALL = 1,
            HISTORY = 2,
            NEXT = 3,
            TODAY = 4, //solo las de hoy
            AFTER_TODAY = 5 //Despues de hoy
        }
    }
}
