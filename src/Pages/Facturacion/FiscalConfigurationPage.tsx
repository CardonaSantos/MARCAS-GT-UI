import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Save, UserRound, PackageSearch } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useStore } from "@/Context/ContextSucursal";
import {
  useCustomerSelectables,
  useProductSelectables,
} from "@/features/common/catalogs/catalog.queries";
import { FeaturePageHeader } from "@/features/common/components/feature-page-header";
import {
  useCreateFiscalEstablishment,
  useUpsertCompanyFiscalProfile,
  useUpsertCustomerFiscalProfile,
  useUpsertProductFiscalProfile,
} from "@/features/facturacion/api/billing.mutations";
import {
  FISCAL_IDENTITY_TYPES,
  FISCAL_ITEM_TYPES,
} from "@/features/facturacion/common/billing.constants";
import {
  toCompanyFiscalPayload,
  toCustomerFiscalPayload,
  toEstablishmentFiscalPayload,
  toProductFiscalPayload,
} from "@/features/facturacion/common/billing.mappers";
import {
  companyFiscalSchema,
  customerFiscalSchema,
  establishmentFiscalSchema,
  productFiscalSchema,
  type CompanyFiscalFormValues,
  type CustomerFiscalFormValues,
  type EstablishmentFiscalFormValues,
  type ProductFiscalFormValues,
} from "@/features/facturacion/schemas/billing.schemas";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormSwitch,
  AppFormTextarea,
} from "@/ui/components/app/form";
import { AppAlert } from "@/ui/components/app/primitives/app-alert";
import { AppCard } from "@/ui/components/app/primitives/app-card";
import { AppContainer } from "@/ui/components/app/primitives/app-container";
import { AppStack } from "@/ui/components/app/primitives/app-stack";

export default function FiscalConfigurationPage() {
  const empresaId = useStore((state) => state.empresaId);
  const role = useStore((state) => state.userRol);
  const customers = useCustomerSelectables();
  const products = useProductSelectables();
  const companyMutation = useUpsertCompanyFiscalProfile();
  const establishmentMutation = useCreateFiscalEstablishment();
  const customerMutation = useUpsertCustomerFiscalProfile();
  const productMutation = useUpsertProductFiscalProfile();

  const companyForm = useForm<CompanyFiscalFormValues>({
    resolver: zodResolver(companyFiscalSchema),
    defaultValues: {
      nit: "",
      razonSocial: "",
      afiliacionIva: "GEN",
      correoFiscal: "",
      direccion: "",
      codigoPostal: "",
      municipio: "",
      departamento: "",
      pais: "GT",
      preciosIncluyenImpuestos: true,
      tasaIvaDefault: "12",
    },
    mode: "onTouched",
  });

  const establishmentForm = useForm<EstablishmentFiscalFormValues>({
    resolver: zodResolver(establishmentFiscalSchema),
    defaultValues: {
      codigoSat: "1",
      nombreComercial: "",
      correo: "",
      direccion: "",
      codigoPostal: "",
      municipio: "",
      departamento: "",
      pais: "GT",
      esPrincipal: true,
    },
    mode: "onTouched",
  });

  const customerForm = useForm<CustomerFiscalFormValues>({
    resolver: zodResolver(customerFiscalSchema),
    defaultValues: {
      clienteId: 0,
      tipoIdentificacion: "NIT",
      identificacion: "",
      nombreFiscal: "",
      correoFiscal: "",
      direccion: "",
      codigoPostal: "",
      municipio: "",
      departamento: "",
      pais: "GT",
    },
    mode: "onTouched",
  });

  const productForm = useForm<ProductFiscalFormValues>({
    resolver: zodResolver(productFiscalSchema),
    defaultValues: {
      productoId: 0,
      bienOServicio: "BIEN",
      unidadMedida: "UN",
      descripcionFiscal: "",
      nombreCortoImpuesto: "IVA",
      codigoUnidadGravable: "1",
      activo: true,
    },
    mode: "onTouched",
  });

  const customerId = useWatch({
    control: customerForm.control,
    name: "clienteId",
  });
  const productId = useWatch({
    control: productForm.control,
    name: "productoId",
  });

  useEffect(() => {
    const customer = (customers.data ?? []).find((item) => item.id === customerId);
    if (!customer) return;
    customerForm.setValue("nombreFiscal", customer.nombreCompleto, { shouldValidate: true });
    customerForm.setValue("correoFiscal", customer.correo ?? "");
    customerForm.setValue("direccion", customer.direccion ?? "");
  }, [customerId, customers.data]);

  useEffect(() => {
    const product = (products.data ?? []).find((item) => item.id === productId);
    if (!product) return;
    productForm.setValue("descripcionFiscal", product.nombre);
  }, [productId, products.data]);

  const saveCompany = async (values: CompanyFiscalFormValues) => {
    if (!empresaId) return;
    await companyMutation.mutateAsync(toCompanyFiscalPayload(empresaId, values));
  };

  const saveEstablishment = async (values: EstablishmentFiscalFormValues) => {
    if (!empresaId) return;
    await establishmentMutation.mutateAsync(
      toEstablishmentFiscalPayload(empresaId, values),
    );
  };

  const saveCustomer = async (values: CustomerFiscalFormValues) => {
    await customerMutation.mutateAsync({
      customerId: values.clienteId,
      payload: toCustomerFiscalPayload(values),
    });
  };

  const saveProduct = async (values: ProductFiscalFormValues) => {
    await productMutation.mutateAsync({
      productId: values.productoId,
      payload: toProductFiscalPayload(values),
    });
  };

  return (
    <AppContainer size="xl" paddingX="none">
      <AppStack gap="lg">
        <FeaturePageHeader
          title="Configuración fiscal"
          description="Perfiles requeridos para preparar documentos DTE antes de habilitar certificación FEL."
          backTo="/marcas-gt/facturacion/facturas"
          backLabel="Volver a facturación"
        />

        <AppAlert
          tone="info"
          title="Configuración de escritura"
          description="El server actual no expone endpoints GET dedicados para empresa y establecimientos fiscales. Estos formularios registran o actualizan la configuración; la preparación del DTE valida luego que esté completa."
        />

        {role === "ADMIN" ? (
          <>
            <AppCard title="Perfil fiscal de empresa" icon={<Building2 />} size="sm">
              <AppForm form={companyForm} onSubmit={saveCompany}>
                <div className="grid gap-3 md:grid-cols-2">
                  <AppFormInput<CompanyFiscalFormValues> name="nit" label="NIT" required />
                  <AppFormInput<CompanyFiscalFormValues> name="razonSocial" label="Razón social" required />
                  <AppFormInput<CompanyFiscalFormValues> name="afiliacionIva" label="Afiliación IVA" required />
                  <AppFormInput<CompanyFiscalFormValues> name="correoFiscal" label="Correo fiscal" type="email" />
                  <AppFormInput<CompanyFiscalFormValues> name="direccion" label="Dirección" required />
                  <AppFormInput<CompanyFiscalFormValues> name="codigoPostal" label="Código postal" />
                  <AppFormInput<CompanyFiscalFormValues> name="municipio" label="Municipio" required />
                  <AppFormInput<CompanyFiscalFormValues> name="departamento" label="Departamento" required />
                  <AppFormInput<CompanyFiscalFormValues> name="pais" label="País" required />
                  <AppFormInput<CompanyFiscalFormValues> name="tasaIvaDefault" label="Tasa IVA (%)" />
                  <AppFormSwitch<CompanyFiscalFormValues>
                    name="preciosIncluyenImpuestos"
                    fieldLabel="Precios incluyen impuestos"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <AppFormSubmit<CompanyFiscalFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                  >
                    Guardar perfil empresa
                  </AppFormSubmit>
                </div>
              </AppForm>
            </AppCard>

            <AppCard title="Nuevo establecimiento fiscal" icon={<Building2 />} size="sm">
              <AppForm form={establishmentForm} onSubmit={saveEstablishment}>
                <div className="grid gap-3 md:grid-cols-2">
                  <AppFormInput<EstablishmentFiscalFormValues> name="codigoSat" label="Código SAT" type="number" required />
                  <AppFormInput<EstablishmentFiscalFormValues> name="nombreComercial" label="Nombre comercial" required />
                  <AppFormInput<EstablishmentFiscalFormValues> name="correo" label="Correo" type="email" />
                  <AppFormInput<EstablishmentFiscalFormValues> name="direccion" label="Dirección" required />
                  <AppFormInput<EstablishmentFiscalFormValues> name="codigoPostal" label="Código postal" />
                  <AppFormInput<EstablishmentFiscalFormValues> name="municipio" label="Municipio" required />
                  <AppFormInput<EstablishmentFiscalFormValues> name="departamento" label="Departamento" required />
                  <AppFormInput<EstablishmentFiscalFormValues> name="pais" label="País" required />
                  <AppFormSwitch<EstablishmentFiscalFormValues>
                    name="esPrincipal"
                    fieldLabel="Establecimiento principal"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <AppFormSubmit<EstablishmentFiscalFormValues>
                    leftIcon={<Save />}
                    loadingText="Guardando..."
                    disableWhenInvalid
                  >
                    Crear establecimiento
                  </AppFormSubmit>
                </div>
              </AppForm>
            </AppCard>
          </>
        ) : null}

        <AppCard title="Perfil fiscal de cliente" icon={<UserRound />} size="sm">
          <AppForm form={customerForm} onSubmit={saveCustomer}>
            <div className="grid gap-3 md:grid-cols-2">
              <AppFormSingleSelect<CustomerFiscalFormValues, number>
                name="clienteId"
                label="Cliente"
                options={(customers.data ?? []).map((customer) => ({
                  value: customer.id,
                  label: customer.nombreCompleto,
                }))}
                isLoading={customers.isLoading}
                required
              />
              <AppFormSingleSelect<CustomerFiscalFormValues, string>
                name="tipoIdentificacion"
                label="Tipo identificación"
                options={FISCAL_IDENTITY_TYPES.map((value) => ({
                  value,
                  label: value,
                }))}
                required
              />
              <AppFormInput<CustomerFiscalFormValues> name="identificacion" label="Identificación" required />
              <AppFormInput<CustomerFiscalFormValues> name="nombreFiscal" label="Nombre fiscal" required />
              <AppFormInput<CustomerFiscalFormValues> name="correoFiscal" label="Correo fiscal" type="email" />
              <AppFormInput<CustomerFiscalFormValues> name="direccion" label="Dirección fiscal" />
              <AppFormInput<CustomerFiscalFormValues> name="codigoPostal" label="Código postal" />
              <AppFormInput<CustomerFiscalFormValues> name="municipio" label="Municipio" />
              <AppFormInput<CustomerFiscalFormValues> name="departamento" label="Departamento" />
              <AppFormInput<CustomerFiscalFormValues> name="pais" label="País" required />
            </div>
            <div className="mt-3 flex justify-end">
              <AppFormSubmit<CustomerFiscalFormValues>
                leftIcon={<Save />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Guardar perfil cliente
              </AppFormSubmit>
            </div>
          </AppForm>
        </AppCard>

        <AppCard title="Perfil fiscal de producto" icon={<PackageSearch />} size="sm">
          <AppForm form={productForm} onSubmit={saveProduct}>
            <div className="grid gap-3 md:grid-cols-2">
              <AppFormSingleSelect<ProductFiscalFormValues, number>
                name="productoId"
                label="Producto"
                options={(products.data ?? []).map((product) => ({
                  value: product.id,
                  label: product.codigo + " · " + product.nombre,
                }))}
                isLoading={products.isLoading}
                required
              />
              <AppFormSingleSelect<ProductFiscalFormValues, string>
                name="bienOServicio"
                label="Tipo fiscal"
                options={FISCAL_ITEM_TYPES.map((value) => ({
                  value,
                  label: value === "BIEN" ? "Bien" : "Servicio",
                }))}
                required
              />
              <AppFormInput<ProductFiscalFormValues> name="unidadMedida" label="Unidad de medida" required />
              <AppFormInput<ProductFiscalFormValues> name="nombreCortoImpuesto" label="Nombre corto impuesto" />
              <AppFormInput<ProductFiscalFormValues> name="codigoUnidadGravable" label="Código unidad gravable" type="number" min={0} />
              <AppFormSwitch<ProductFiscalFormValues> name="activo" fieldLabel="Perfil activo" />
              <div className="md:col-span-2">
                <AppFormTextarea<ProductFiscalFormValues>
                  name="descripcionFiscal"
                  label="Descripción fiscal"
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <AppFormSubmit<ProductFiscalFormValues>
                leftIcon={<Save />}
                loadingText="Guardando..."
                disableWhenInvalid
              >
                Guardar perfil producto
              </AppFormSubmit>
            </div>
          </AppForm>
        </AppCard>
      </AppStack>
    </AppContainer>
  );
}
