import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { VentaHistorialPDF } from "@/Types/PDF/VentaHistorialPDF";
import Garantia from "./Garantia";
const API_URL = import.meta.env.VITE_API_URL;

function GarantiaPage() {
  // Obtén el parámetro idSale de la URL
  const { id } = useParams(); // Extrae el valor de idSale
  console.log("El id del param es: ", id);

  const [venta, setVenta] = useState<VentaHistorialPDF>();

  const getSale = async () => {
    try {
      // Asegúrate de concatenar correctamente el idSale a la URL
      const response = await axios.get(`${API_URL}/venta/get-sale/${id}`);
      if (response.status === 200) {
        setVenta(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir el registro de venta");
      toast.error("Error al encontrar registro de venta");
    }
  };

  useEffect(() => {
    getSale();
  }, [id]); // Escucha por cambios en idSale

  console.log("La venta para la garantía es: ", venta);

  return (
    <div>
      {venta && venta ? (
        <PDFViewer width="100%" height="600">
          <Garantia venta={venta} />
        </PDFViewer>
      ) : (
        <p className="text-center font-extrabold text-xl">Cargando PDF</p>
      )}
    </div>
  );
}

export default GarantiaPage;
