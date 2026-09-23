import * as React from "react";
import Select, {
  type ActionMeta,
  type ClassNamesConfig,
  type GroupBase,
  type MultiValue,
  type Props as ReactSelectProps,
  type SelectInstance,
  type StylesConfig,
} from "react-select";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  appSelectControlVariants,
  appSelectIndicatorVariants,
  appSelectMenuVariants,
  appSelectMessageVariants,
  appSelectMultiValueLabelVariants,
  appSelectMultiValueRemoveVariants,
  appSelectMultiValueVariants,
  appSelectOptionVariants,
  appSelectTextVariants,
  appSelectValueContainerVariants,
} from "../theme/app-react-select.variants";
import type { AppSelectOption, AppSelectValue } from "./app-single-select";
import { useAppSelectPortalTarget } from "./app-select-portal-context";

type AppSelectDensity = "default" | "compact" | "dense";

type AppSelectControlVariantProps = VariantProps<
  typeof appSelectControlVariants
>;

interface AppMultiSelectVisualProps {
  variant?: AppSelectControlVariantProps["variant"];
  size?: AppSelectControlVariantProps["size"];
  radius?: AppSelectControlVariantProps["radius"];
  intent?: AppSelectControlVariantProps["intent"];
  fieldWidth?: AppSelectControlVariantProps["fieldWidth"];

  /**
   * Comprime texto, padding, control, chips, opciones e indicadores.
   * Útil para barras de filtros densas.
   */
  density?: AppSelectDensity;

  /**
   * Alias temporal por compatibilidad.
   * Preferir density.
   */
  menuDensity?: AppSelectDensity;
}

export interface AppMultiSelectProps<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>
  extends
    Omit<
      ReactSelectProps<
        AppSelectOption<TValue, TMeta>,
        true,
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
    AppMultiSelectVisualProps {
  value?: TValue[];
  options: Array<AppSelectOption<TValue, TMeta>>;
  selectedOptions?: Array<AppSelectOption<TValue, TMeta>>;
  onChange?: (
    values: TValue[],
    options: Array<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => void;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  multiValueClassName?: string;
  noOptionsText?: string;
  loadingText?: string;
  portalToBody?: boolean;
  selectStyles?: StylesConfig<
    AppSelectOption<TValue, TMeta>,
    true,
    GroupBase<AppSelectOption<TValue, TMeta>>
  >;
}

function getSelectControlDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "min-h-[30px] text-[10px]";
  }

  if (density === "compact") {
    return "min-h-[30px] text-[10px]";
  }

  return "";
}

function getSelectValueContainerDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "gap-0.5 px-1 py-0";
  }

  if (density === "compact") {
    return "gap-0.5 px-1 py-0";
  }

  return "gap-1";
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

function getSelectMultiValueDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "my-0 max-w-[70px] text-[9px] leading-[11px]";
  }

  if (density === "compact") {
    return "my-0 max-w-[82px] text-[9.5px] leading-[12px]";
  }

  return "";
}

function getSelectMultiValueLabelDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "truncate px-1 py-0 !text-[9px] !leading-[11px]";
  }

  if (density === "compact") {
    return "truncate px-1 py-0 !text-[9.5px] !leading-[12px]";
  }

  return "";
}

function getSelectMultiValueRemoveDensityClass(density: AppSelectDensity) {
  if (density === "dense") {
    return "px-0.5 py-0 [&>svg]:h-2.5 [&>svg]:w-2.5";
  }

  if (density === "compact") {
    return "px-0.5 py-0 [&>svg]:h-3 [&>svg]:w-3";
  }

  return "";
}

function buildAppMultiSelectClassNames<TValue extends AppSelectValue, TMeta>({
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
  multiValueClassName,
}: {
  variant?: AppMultiSelectVisualProps["variant"];
  size?: AppMultiSelectVisualProps["size"];
  radius?: AppMultiSelectVisualProps["radius"];
  intent?: AppMultiSelectVisualProps["intent"];
  fieldWidth?: AppMultiSelectVisualProps["fieldWidth"];
  density?: AppSelectDensity;
  invalid?: boolean;
  containerClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  multiValueClassName?: string;
}): ClassNamesConfig<
  AppSelectOption<TValue, TMeta>,
  true,
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
        "flex-wrap",
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

    multiValue: () =>
      cn(
        appSelectMultiValueVariants({
          size,
          radius,
        }),
        getSelectMultiValueDensityClass(density),
        multiValueClassName,
      ),

    multiValueLabel: () =>
      cn(
        appSelectMultiValueLabelVariants({
          size,
        }),
        getSelectMultiValueLabelDensityClass(density),
      ),

    multiValueRemove: () =>
      cn(
        appSelectMultiValueRemoveVariants({
          size,
        }),
        getSelectMultiValueRemoveDensityClass(density),
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
          radius: radius === "full" ? "lg" : radius,
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

function AppMultiSelectInner<
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  {
    value = [],
    selectedOptions,
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
    multiValueClassName,
    placeholder = "Seleccione opciones",
    noOptionsText = "Sin opciones",
    loadingText = "Cargando...",
    isClearable = true,
    isSearchable = true,
    closeMenuOnSelect = false,
    hideSelectedOptions = false,
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
  }: AppMultiSelectProps<TValue, TMeta>,
  ref: React.ForwardedRef<
    SelectInstance<
      AppSelectOption<TValue, TMeta>,
      true,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
  >,
) {
  const contextMenuPortalTarget = useAppSelectPortalTarget();

  const resolvedDensity = density ?? menuDensity ?? "default";

  const selected = React.useMemo(() => {
    if (selectedOptions?.length) {
      return selectedOptions;
    }

    if (!value.length) {
      return [];
    }

    const selectedValueSet = new Set(value);

    return options.filter((option) => selectedValueSet.has(option.value));
  }, [options, selectedOptions, value]);

  const classNames = React.useMemo(
    () =>
      buildAppMultiSelectClassNames<TValue, TMeta>({
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
        multiValueClassName,
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
      multiValueClassName,
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
    newValue: MultiValue<AppSelectOption<TValue, TMeta>>,
    actionMeta: ActionMeta<AppSelectOption<TValue, TMeta>>,
  ) => {
    const nextOptions = [...newValue];
    const nextValues = nextOptions.map((option) => option.value);

    onChange?.(nextValues, nextOptions, actionMeta);
  };

  return (
    <Select<
      AppSelectOption<TValue, TMeta>,
      true,
      GroupBase<AppSelectOption<TValue, TMeta>>
    >
      ref={ref}
      unstyled
      isMulti
      value={selected}
      options={options}
      onChange={handleChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={hideSelectedOptions}
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

const AppMultiSelect = React.forwardRef(AppMultiSelectInner) as <
  TValue extends AppSelectValue = string,
  TMeta = unknown,
>(
  props: AppMultiSelectProps<TValue, TMeta> & {
    ref?: React.ForwardedRef<
      SelectInstance<
        AppSelectOption<TValue, TMeta>,
        true,
        GroupBase<AppSelectOption<TValue, TMeta>>
      >
    >;
  },
) => React.ReactElement;

export { AppMultiSelect };
