import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import WarrantyFinalPDF from "./WarrantyFinalPDF";
import { RegistroGarantiaFINALPDFType } from "./WarrantyFinalPDFType";
const API_URL = import.meta.env.VITE_API_URL;

function WarrantyFinalPage() {
  const { id } = useParams<{ id: string }>();
  const [registro, setRegistro] = useState<RegistroGarantiaFINALPDFType | null>(
    null
  );

  const getRegistro = async () => {
    try {
      const response = await axios.get<RegistroGarantiaFINALPDFType>(
        `${API_URL}/warranty/get-one-regist-final-pdf/${id}`
      );
      if (response.status === 200) {
        setRegistro(response.data);
      }
    } catch (error) {
      console.error("Error al conseguir el registro de garantía", error);
      toast.error("Error al encontrar registro de garantía");
    }
  };

  useEffect(() => {
    getRegistro();
  }, [id]);

  console.log("El comprobante final tendría esta información: ", registro);

  return (
    <div className="container mx-auto p-4">
      {registro && registro ? (
        <PDFViewer width="100%" height="600">
          <WarrantyFinalPDF registro={registro} />
        </PDFViewer>
      ) : (
        <p className="text-center font-extrabold text-xl">Cargando PDF</p>
      )}
    </div>
  );
}

export default WarrantyFinalPage;
