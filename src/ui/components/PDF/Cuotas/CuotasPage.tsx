import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import CuotaComprobante from "./CuotaComprobante";
import { CuotaType2 } from "./CuotaType2";
const API_URL = import.meta.env.VITE_API_URL;

function CuotasPage() {
  // Obtén el parámetro idSale de la URL
  const { id } = useParams(); // Extrae el valor de idSale
  console.log("El id del param es: ", id);

  const [cuota, setCuota] = useState<CuotaType2>();

  const getSale = async () => {
    try {
      // Asegúrate de concatenar correctamente el idSale a la URL
      const response = await axios.get(
        `${API_URL}/cuotas/get/comprobante/cuota/${id}`
      );
      if (response.status === 200) {
        setCuota(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir el registro de venta");
      toast.error("Error al encontrar registro de venta");
    }
  };

  useEffect(() => {
    getSale();
  }, [id]); // Escucha por cambios en idSale

  console.log("El reguistro de cuota pagada es: ", cuota);

  return (
    <div>
      {cuota && cuota ? (
        <PDFViewer width="100%" height="600">
          <CuotaComprobante venta={cuota} />
        </PDFViewer>
      ) : (
        <p className="text-center font-extrabold text-xl">Cargando PDF...</p>
      )}
    </div>
  );
}

export default CuotasPage;
