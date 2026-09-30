import * as React from "react";
import Select, {
  type ActionMeta,
  type ClassNamesConfig,
  type GroupBase,
  type Props as ReactSelectProps,
  type SelectInstance,
  type SingleValue,
  type StylesConfig,
} from "react-select";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSelectControlVariants,
  appSelectIndicatorVariants,
  appSelectMenuVariants,
  appSelectMessageVariants,
  appSelectOptionVariants,
  appSelectTextVariants,
  appSelectValueContainerVariants,
} from "../theme/app-react-select.variants";
import { useAppSelectPortalTarget } from "./app-select-portal-context";

export type AppSelectValue = string | number;

export interface AppSelectOption<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
> {
  value: TValue;
  label: string;
  description?: string;
  isDisabled?: boolean;
  meta?: TMeta;
}

type AppSelectDensity = "default" | "compact" | "dense";

type AppSelectControlVariantProps = VariantProps<
  typeof appSelectControlVariants
>;

interface AppSelectVisualProps {
  variant?: AppSelectControlVariantProps["variant"];
  size?: AppSelectControlVariantProps["size"];
  radius?: AppSelectControlVariantProps["radius"];
  intent?: AppSelectControlVariantProps["intent"];
  fieldWidth?: AppSelectControlVariantProps["fieldWidth"];

  /**
   * Comprime texto, padding, control, opciones e indicadores.
   * Útil para barras de filtros densas.
   */
  density?: AppSelectDensity;

  /**
   * Alias temporal para compatibilidad si ya usaste menuDensity.
   * Preferir density.
   */
  menuDensity?: AppSelectDensity;
}

export interface AppSingleSelectProps<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>
  extends
    Omit<
      ReactSelectProps<
        AppSelectOption<TValue, TMeta>,
        false,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >,
      | "isMulti"
      | "options"
      | "value"
      | "onChange"
      | "classNames"
      | "unstyled"
      | "styles"
      | "getOptionValue"
      | "getOptionLabel"
      | "noOptionsMessage"
      | "loadingMessage"
    >,
    AppSelectVisualProps {
  value?: TValue | null;
  options: Array<AppSelectOption<TValue, TMeta>>;
  selectedOption?: AppSelectOption<TValue, TMeta> | null;
  onChange?: (
    value: TValue | null,
    option: AppSelectOption<TValue, TMeta> | null,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => void;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  noOptionsText?: string;
  loadingText?: string;

  /**
   * true:
   * - fuera de dialogs: portal a document.body
   * - dentro de AppConfirmDialog: se desactiva portal automáticamente
   *
   * false:
   * - renderiza el menú dentro del flujo normal.
   */
  portalToBody?: boolean;

  selectStyles?: StylesConfig<
    AppSelectOption<TValue, TMeta>,
    false,
    GroupBase<AppSelectOption<TValue, TMeta>>
  >;
}
function getSelectControlDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "h-[30px] min-h-[30px] text-[10px]";
  }

  if (density === "compact") {
    return "h-[30px] min-h-[30px] text-[10px]";
  }

  return "";
}

function getSelectValueContainerDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "px-1 py-0";
  }

  if (density === "compact") {
    return "px-1 py-0";
  }

  return "";
}

function getSelectTextDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "!text-[9.5px] !leading-[12px]";
  }

  if (density === "compact") {
    return "!text-[9.5px] !leading-[12px]";
  }

  return "";
}

function getSelectIndicatorDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "px-0.5 py-0 [&>svg]:h-3 [&>svg]:w-3";
  }

  if (density === "compact") {
    return "px-0.5 py-0 [&>svg]:h-3 [&>svg]:w-3";
  }

  return "";
}

function getSelectMenuListDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "max-h-52 py-0.5";
  }

  if (density === "compact") {
    return "max-h-56 py-0.5";
  }

  return "py-1 max-h-[var(--app-select-menu-max-height)]";
}

function getSelectOptionDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "px-1.5 py-1 !text-[9px] !leading-[11px] [&_*]:!text-[9px] [&_*]:!leading-[11px]";
  }

  if (density === "compact") {
    return "px-1.5 py-1 !text-[9.5px] !leading-[12px] [&_*]:!text-[9.5px] [&_*]:!leading-[12px]";
  }

  return "";
}

function getSelectMessageDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "px-2 py-1 !text-[9px]";
  }

  if (density === "compact") {
    return "px-2 py-1 !text-[9.5px]";
  }

  return "";
}

function buildAppSingleSelectClassNames<TValue extends AppSelectValue, TMeta>({
  variant,
  size,
  radius,
  intent,
  fieldWidth,
  density = "default",
  invalid,
  containerClassName,
  controlClassName,
  menuClassName,
  optionClassName,
}: {
  variant?: AppSelectVisualProps["variant"];
  size?: AppSelectVisualProps["size"];
  radius?: AppSelectVisualProps["radius"];
  intent?: AppSelectVisualProps["intent"];
  fieldWidth?: AppSelectVisualProps["fieldWidth"];
  density?: AppSelectDensity;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}): ClassNamesConfig<
  AppSelectOption<TValue, TMeta>,
  false,
  GroupBase<AppSelectOption<TValue, TMeta>>
> {
  const resolvedIntent = invalid ? "error" : intent;

  return {
    container: () =>
      cn(fieldWidth === "auto" ? "w-auto" : "w-full", containerClassName),

    control: ({ isFocused, isDisabled }) =>
      cn(
        appSelectControlVariants({
          variant,
          size,
          radius,
          intent: resolvedIntent,
          fieldWidth,
          isFocused,
          isDisabled,
        }),
        getSelectControlDensityClass(density),
        controlClassName,
      ),

    valueContainer: () =>
      cn(
        appSelectValueContainerVariants({
          size,
        }),
        getSelectValueContainerDensityClass(density),
      ),

    input: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "value",
        }),
        getSelectTextDensityClass(density),
        "m-0 p-0",
      ),

    placeholder: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "placeholder",
        }),
        getSelectTextDensityClass(density),
      ),

    singleValue: () =>
      cn(
        appSelectTextVariants({
          size,
          tone: "value",
        }),
        getSelectTextDensityClass(density),
      ),

    indicatorsContainer: () => "h-full",

    indicatorSeparator: () => "hidden",

    dropdownIndicator: ({ selectProps }) =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
        getSelectIndicatorDensityClass(density),
        selectProps.menuIsOpen && "rotate-180",
      ),

    clearIndicator: () =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
        getSelectIndicatorDensityClass(density),
      ),

    loadingIndicator: () =>
      cn(
        appSelectIndicatorVariants({
          size,
        }),
        getSelectIndicatorDensityClass(density),
      ),

    menuPortal: () => "app-select-menu-portal",

    menu: () =>
      cn(
        appSelectMenuVariants({
          radius,
        }),
        menuClassName,
      ),

    menuList: () =>
      cn("overflow-y-auto", getSelectMenuListDensityClass(density)),

    option: ({ isFocused, isSelected, isDisabled }) =>
      cn(
        appSelectOptionVariants({
          size,
          isFocused,
          isSelected,
          isDisabled,
        }),
        getSelectOptionDensityClass(density),
        optionClassName,
      ),

    noOptionsMessage: () =>
      cn(
        appSelectMessageVariants({
          size,
        }),
        getSelectMessageDensityClass(density),
      ),

    loadingMessage: () =>
      cn(
        appSelectMessageVariants({
          size,
        }),
        getSelectMessageDensityClass(density),
      ),
  };
}

function AppSingleSelectInner<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  {
    value = null,
    selectedOption,
    options,
    onChange,
    invalid = false,
    variant,
    size,
    radius,
    intent,
    fieldWidth,
    density,
    menuDensity,
    containerClassName,
    controlClassName,
    menuClassName,
    optionClassName,
    placeholder = "Seleccione una opción",
    noOptionsText = "Sin opciones",
    loadingText = "Cargando...",
    isClearable = true,
    isSearchable = true,
    isDisabled,
    isLoading,
    portalToBody = true,
    menuPortalTarget,
    menuPosition,
    selectStyles,
    menuShouldBlockScroll = false,
    closeMenuOnScroll = false,
    menuShouldScrollIntoView = false,
    ...props
  }: AppSingleSelectProps<TValue, TMeta>,
  ref: React.ForwardedRef<
    SelectInstance<
      AppSelectOption<TValue, TMeta>,
      false,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
  >,
) {
  const contextMenuPortalTarget = useAppSelectPortalTarget();

  const resolvedDensity = density ?? menuDensity ?? "default";

  /**
   * undefined = no hay AppConfirmDialog provider.
   * null / HTMLElement = sí estamos dentro de AppConfirmDialog.
   *
   * Dentro del dialog NO portaleamos el menú.
   * ReactSelect + portal a AlertDialog.Content + fixed puede calcular mal posición.
   */
  // const isInsideAppDialog = contextMenuPortalTarget !== undefined;

  const selected = React.useMemo(() => {
    if (value === null || value === undefined) return null;

    if (selectedOption && selectedOption.value === value) {
      return selectedOption;
    }

    return options.find((option) => option.value === value) ?? null;
  }, [options, selectedOption, value]);

  const classNames = React.useMemo(
    () =>
      buildAppSingleSelectClassNames<TValue, TMeta>({
        variant,
        size,
        radius,
        intent,
        fieldWidth,
        density: resolvedDensity,
        invalid,
        containerClassName,
        controlClassName,
        menuClassName,
        optionClassName,
      }),
    [
      variant,
      size,
      radius,
      intent,
      fieldWidth,
      resolvedDensity,
      invalid,
      containerClassName,
      controlClassName,
      menuClassName,
      optionClassName,
    ],
  );

  const hasPortalContext = contextMenuPortalTarget !== undefined;

  const resolvedMenuPortalTarget =
    menuPortalTarget ??
    (portalToBody
      ? hasPortalContext
        ? (contextMenuPortalTarget ?? undefined)
        : typeof document !== "undefined"
          ? document.body
          : undefined
      : undefined);

  const resolvedMenuPosition =
    menuPosition ?? (resolvedMenuPortalTarget ? "fixed" : "absolute");

  const handleChange = (
    newValue: SingleValue<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => {
    onChange?.(newValue?.value ?? null, newValue ?? null, actionMeta);
  };

  return (
    <Select<
      AppSelectOption<TValue, TMeta>,
      false,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
      ref={ref}
      unstyled
      isMulti={false}
      value={selected}
      options={options}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      isLoading={isLoading}
      placeholder={placeholder}
      classNames={classNames}
      menuPortalTarget={resolvedMenuPortalTarget}
      menuPosition={resolvedMenuPosition}
      menuShouldBlockScroll={menuShouldBlockScroll}
      closeMenuOnScroll={closeMenuOnScroll}
      menuShouldScrollIntoView={menuShouldScrollIntoView}
      // styles={{
      //   menuPortal: (base) => ({
      //     ...base,
      //     zIndex: "var(--app-select-menu-z-index, 9999)",
      //   }),
      //   ...selectStyles,
      // }}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: "var(--app-select-menu-z-index, 2147483647)",
          pointerEvents: "auto",
        }),
        menu: (base) => ({
          ...base,
          zIndex: "var(--app-select-menu-z-index, 2147483647)",
          pointerEvents: "auto",
        }),
        ...selectStyles,
      }}
      getOptionValue={(option) => String(option.value)}
      getOptionLabel={(option) => option.label}
      isOptionDisabled={(option) => Boolean(option.isDisabled)}
      noOptionsMessage={() => noOptionsText}
      loadingMessage={() => loadingText}
      {...props}
    />
  );
}

const AppSingleSelect = React.forwardRef(AppSingleSelectInner) as <
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  props: AppSingleSelectProps<TValue, TMeta> & {
    ref?: React.ForwardedRef<
      SelectInstance<
        AppSelectOption<TValue, TMeta>,
        false,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >
    >;
  },
) => React.ReactElement;

export { AppSingleSelect };
