using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class CaballoFilterBLL : BLLBase
    {
        private const string PARAM_NOMBRE_CABALLO = "QPCNombre";
        private const string PARAM_PROPIETARIO_CABALLO = "QPCPropietario";
        private const string PARAM_GENERO_CABALLO = "QPCGenero";
        private const string PARAM_PELAJE_CABALLO = "QPCPelaje";
        private const string PARAM_ANIO_CABALLO = "QPCAnio";
        private const string PARAM_PADRE_CABALLO = "QPCPadre";
        private const string PARAM_MADRE_CABALLO = "QPCMadre";
        private const string PARAM_NOMBRE_CRIADOR_CABALLO = "QPCNombreCriador";
        private const string PARAM_PAIS_CRIADOR_CABALLO = "QPCPaisCriador";
        private const string PARAM_ADN_CABALLO = "QPCADN";
        private const string PARAM_CHIP_CABALLO = "QPCChip";
        private const string PARAM_NUM_ID_CABALLO = "QPCNumeroID";
        private const string PARAM_OTRAS_MARCAS_CABALLO = "QPCOtrasMarcas";
        private const string PARAM_REGISTRO_RFN_CABALLO = "QPCRegistroRFN";
        private const string PARAM_PAGADO_RFN_CABALLO = "QPCPagadoRFN";
        private const string PARAM_REGISTRO_RFI_CABALLO = "QPCRegistroRFI";
        private const string PARAM_PAGADO_RFI_CABALLO = "QPCPagadoRFI";
        private const string PARAM_PROTECTORES_CABALLO = "QPCProtectores";
        private const string PARAM_OBSERVACIONES_CABALLO = "QPCObservaciones";
        private const string PARAM_EMBOCADURA_CABALLO = "QPCEmbocadura";
        private const string PARAM_EXT_CABEZADA_CABALLO = "QPCExtCabezada";
        private const string PARAM_NOMBRE_ENCARGADO_CABALLO = "QPCNombreEncargado";
        private const string PARAM_TELEFONO_ENCARGADO_CABALLO = "QPCTelefonoEncargado";
        private const string PARAM_EMAIL_ENCARGADO_CABALLO = "QPCEmailEncargado";

        public List<int> GetIdsCaballosByFilter(int propietarioId, Dictionary<String, string> parameters)
        {
            string valueParam;
            using(var db = _dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                var query = db.Caballo.Where(c => c.Propietario_ID == propietarioId);
                //nombre caballo
                if (parameters.TryGetValue(PARAM_NOMBRE_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.Nombre != null && c.Nombre.ToUpper().Contains(value));
                }
                //Nombre propietario
                if (parameters.TryGetValue(PARAM_PROPIETARIO_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.NombrePropietario != null && c.NombrePropietario.ToUpper().Contains(value));
                }
                //genero caballo
                if (parameters.TryGetValue(PARAM_GENERO_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.Genero_ID == value);
                }
                //pelaje caballo
                if (parameters.TryGetValue(PARAM_PELAJE_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.Pelaje_ID == value);
                }
                //aino caballo
                if (parameters.TryGetValue(PARAM_ANIO_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.FechaNacimiento != null && c.FechaNacimiento.Value.Year == value);
                }
                //padre
                if (parameters.TryGetValue(PARAM_PADRE_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.GenealogiaCaballo.Padre != null && c.GenealogiaCaballo.Padre.ToUpper().Contains(value));
                }
                //madre
                if (parameters.TryGetValue(PARAM_MADRE_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.GenealogiaCaballo.Madre != null && c.GenealogiaCaballo.Madre.ToUpper().Contains(value));
                }
                //nombre cridador
                if (parameters.TryGetValue(PARAM_NOMBRE_CRIADOR_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.CriadorCaballo.Nombre != null && c.CriadorCaballo.Nombre.ToUpper().Contains(value));
                }
                //pais criador
                if (parameters.TryGetValue(PARAM_PAIS_CRIADOR_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.CriadorCaballo.Pais_ID != null && c.CriadorCaballo.Pais_ID == value);
                }
                //adn caballo
                if (parameters.TryGetValue(PARAM_ADN_CABALLO, out valueParam))
                {
                    bool value = bool.Parse(valueParam);
                    query = query.Where(c => c.ADN != null && c.ADN == value);
                }
                //chip caballo
                if (parameters.TryGetValue(PARAM_CHIP_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.NumeroChip != null && c.NumeroChip.ToUpper().Contains(value));
                }
                //numero caballo
                if (parameters.TryGetValue(PARAM_NUM_ID_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.NumeroId != null && c.NumeroId.ToUpper().Contains(value));
                }
                //otras marcas
                if (parameters.TryGetValue(PARAM_OTRAS_MARCAS_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.Marcas != null && c.Marcas.ToUpper().Contains(value));
                }
                //Registro RFI
                if (parameters.TryGetValue(PARAM_REGISTRO_RFI_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.NumeroFEI != null && c.NumeroFEI == value);
                }
                //pagado RFI
                if (parameters.TryGetValue(PARAM_PAGADO_RFI_CABALLO, out valueParam))
                {
                    bool value = bool.Parse(valueParam);
                    query = query.Where(c => c.EstadoFEI != null && c.EstadoFEI == value);
                }
                //Registro FEN
                if (parameters.TryGetValue(PARAM_REGISTRO_RFN_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.NumeroFEN != null && c.NumeroFEN == value);
                }
                //pagado FEN
                if (parameters.TryGetValue(PARAM_PAGADO_RFN_CABALLO, out valueParam))
                {
                    bool value = bool.Parse(valueParam);
                    query = query.Where(c => c.EstadoFEN != null && c.EstadoFEN == value);
                }
                //protectores
                if (parameters.TryGetValue(PARAM_PROTECTORES_CABALLO, out valueParam))
                {
                    int value = int.Parse(valueParam);
                    query = query.Where(c => c.Protector_ID != null && c.Protector_ID == value);
                }
                //observaciones
                if (parameters.TryGetValue(PARAM_OBSERVACIONES_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.Observaciones != null && c.Observaciones.ToUpper().Contains(value));
                }
                //embocadura
                if (parameters.TryGetValue(PARAM_EMBOCADURA_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.Embocadura != null && c.Embocadura.ToUpper().Contains(value));
                }
                //extras cabezada
                if (parameters.TryGetValue(PARAM_EXT_CABEZADA_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.ExtrasDeCabezada != null && c.ExtrasDeCabezada.ToUpper().Contains(value));
                }
                //noombre encargado
                if (parameters.TryGetValue(PARAM_NOMBRE_ENCARGADO_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.ResponsableCaballo.Nombre != null && c.ResponsableCaballo.Nombre.ToUpper().Contains(value));
                }
                //telefono encargado
                if (parameters.TryGetValue(PARAM_TELEFONO_ENCARGADO_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.ResponsableCaballo.Telefono != null && c.ResponsableCaballo.Telefono.ToUpper().Contains(value));
                }
                //email encargado
                if (parameters.TryGetValue(PARAM_EMAIL_ENCARGADO_CABALLO, out valueParam))
                {
                    string value = valueParam.ToUpper();
                    query = query.Where(c => c.ResponsableCaballo.CorreoElectronico != null && c.ResponsableCaballo.CorreoElectronico.ToUpper().Contains(value));
                }
                return query.Select(c => c.ID).ToList();
            }
        }
    }
}
