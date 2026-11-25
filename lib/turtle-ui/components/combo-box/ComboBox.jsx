import { Combobox as ComboBoxPrimitives } from "@base-ui/react";
import { CaretDownIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import PropTypes from "prop-types";
import { cn, inputboxVariants } from "@turtle-ui/utils";

export const ComboBox = ({
  labelKey = "", // required
  valueKey = "", // required
  optionKey = "", // required
  options = [], // optional
  selectedOption = null, // optional
  placeholder = "Select an option", // optional // default
  label = "",

  // Actions

  renderTrigger = null, // optional // default null
  renderOption = null, // optional // default null
  onSelect = undefined, // optional // default undefined
  onSelectOpen = undefined, // optional // default undefined
  onSearchChange = undefined, // optional // default undefined

  // Options
  showSearch = true, // optional // default true
  error = false, // optional // default false
  isDisabled = false, // optional // default false
  showClearBtn = true, // optional // default false
  isLoading = false, // optional // default false
  isMulti = false, // optional // default false
  // classNames
  optionClassName = "",
  triggerClassName = "",
  popupClassName = "",
  clearBtnClassName = "",
  iconClassName = "",
}) => {
  const renderDefaultTrigger = () => {
    const noValSelected = isMulti ? !selectedOption?.length : !selectedOption;

    // custom trigger

    if (renderTrigger) {
      if (noValSelected) {
        return (
          <>
            <ComboBoxPrimitives.Value placeholder={placeholder} />

            <ComboBoxPrimitives.Icon
              className={cn("text-gray-400", iconClassName)}
            >
              <CaretDownIcon size={16} />
            </ComboBoxPrimitives.Icon>
          </>
        );
      }

      return (
        <>
          {renderTrigger(selectedOption)}

          <div className="flex items-center gap-2 shrink-0">
            {showClearBtn && (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(isMulti ? [] : null);
                }}
                className={cn("text-gray-400", clearBtnClassName)}
              >
                <XIcon size={14} />
              </button>
            )}

            <ComboBoxPrimitives.Icon
              className={cn("text-gray-400", iconClassName)}
            >
              <CaretDownIcon size={16} />
            </ComboBoxPrimitives.Icon>
          </div>
        </>
      );
    }

    if (noValSelected) {
      return (
        <>
          <ComboBoxPrimitives.Value placeholder={placeholder} />

          <ComboBoxPrimitives.Icon
            className={cn("text-gray-400", iconClassName)}
          >
            <CaretDownIcon size={16} />
          </ComboBoxPrimitives.Icon>
        </>
      );
    }

    return (
      <>
        {isMulti ? (
          <ComboBoxPrimitives.Chips className="flex flex-1 flex-wrap gap-1">
            <ComboBoxPrimitives.Value>
              {(value) => (
                <>
                  {value.map((option) => (
                    <ComboBoxPrimitives.Chip
                      key={option?.[optionKey] || option?.[valueKey]}
                      className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
                    >
                      {option?.[labelKey]}

                      <ComboBoxPrimitives.ChipRemove
                        className="text-gray-500"
                        aria-label={`Remove ${option?.[labelKey]}`}
                      >
                        <XIcon size={14} />
                      </ComboBoxPrimitives.ChipRemove>
                    </ComboBoxPrimitives.Chip>
                  ))}

                  <ComboBoxPrimitives.Input
                    placeholder={value.length > 0 ? "" : placeholder}
                    className="min-w-20 flex-1 outline-none"
                  />
                </>
              )}
            </ComboBoxPrimitives.Value>
          </ComboBoxPrimitives.Chips>
        ) : (
          <ComboBoxPrimitives.Value placeholder={placeholder} />
        )}

        <div className="flex items-center gap-2 shrink-0">
          {showClearBtn && (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(isMulti ? [] : null);
              }}
              className={cn("text-gray-400", clearBtnClassName)}
            >
              <XIcon size={14} />
            </button>
          )}

          <ComboBoxPrimitives.Icon
            className={cn("text-gray-400", iconClassName)}
          >
            <CaretDownIcon size={16} />
          </ComboBoxPrimitives.Icon>
        </div>
      </>
    );
  };

  return (
    <ComboBoxPrimitives.Root
      items={options}
      filteredItems={!showSearch ? options : undefined}
      filter={!showSearch ? null : undefined}
      onValueChange={onSelect}
      value={selectedOption}
      itemToStringLabel={(item) => item?.[labelKey] ?? ""}
      itemToStringValue={(item) => String(item?.[valueKey] ?? "")}
      onOpenChange={(open) => open && onSelectOpen?.()}
      disabled={isDisabled}
      multiple={isMulti}
    >
      {label && (
        <ComboBoxPrimitives.Label className="cursor-default text-sm mb-1 text-body">
          {label}
        </ComboBoxPrimitives.Label>
      )}

      <ComboBoxPrimitives.Trigger
        className={inputboxVariants({
          variant: error ? "danger" : "primary",
          size: "md",
          className: cn(
            `flex items-center justify-between gap-4 w-auto ${isMulti && "h-fit"}`,
            triggerClassName,
          ),
        })}
      >
        {renderDefaultTrigger()}
      </ComboBoxPrimitives.Trigger>

      <ComboBoxPrimitives.Portal>
        <ComboBoxPrimitives.Positioner
          align="start"
          className="z-50"
          sideOffset={4}
        >
          <ComboBoxPrimitives.Popup
            className={cn(
              "border-2 rounded-lg border-gray-200 overflow-clip shadow-lg [--input-container-height:2rem] max-h-[24.5rem] min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-white text-neutral-950 transition-[scale,opacity] duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-90 data-ending-style:opacity-0",
              popupClassName,
            )}
            aria-label={label}
          >
            {showSearch && (
              <div className="p-1">
                <ComboBoxPrimitives.Input
                  placeholder="Search..."
                  className={inputboxVariants({
                    variant: "primary",
                    size: "sm",
                    className: "flex items-center w-full h-8",
                  })}
                  onChange={({ target: { value } }) => onSearchChange?.(value)}
                />
              </div>
            )}

            <div className="border-x border-b border-neutral-950 dark:border-white">
              {isLoading ? (
                <p className="w-full px-4 py-2.5 text-center text-sm text-gray-400">
                  Loading...
                </p>
              ) : (
                <>
                  <ComboBoxPrimitives.Empty>
                    <p className="w-full px-4 py-2.5 text-center text-sm text-gray-400">
                      No data found!
                    </p>
                  </ComboBoxPrimitives.Empty>

                  <ComboBoxPrimitives.List className="max-h-[min(calc(24.5rem-var(--input-container-height)-2px),calc(var(--available-height)-var(--input-container-height)-2px))] overflow-auto overscroll-contain py-1 scroll-py-1 empty:p-0">
                    {(option) => (
                      <ComboBoxPrimitives.Item
                        key={option?.[optionKey] || option?.[valueKey]}
                        value={option}
                        className={cn(
                          "cursor-default flex items-center gap-2 px-4 py-2.5 text-sm leading-4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-selected:bg-brand-50 data-highlighted:text-gray-700 data-highlighted:before:absolute data-highlighted:before:inset-0 data-highlighted:before:z-[-1] data-highlighted:before:bg-gray-50",
                          optionClassName,
                        )}
                        render={(item) => renderOption?.(option, item)}
                      >
                        <p className="grow line-clamp-2">
                          {option?.[labelKey]}
                        </p>
                        <ComboBoxPrimitives.ItemIndicator className="text-gray-500">
                          <CheckIcon size={16} />
                        </ComboBoxPrimitives.ItemIndicator>
                      </ComboBoxPrimitives.Item>
                    )}
                  </ComboBoxPrimitives.List>
                </>
              )}
            </div>
          </ComboBoxPrimitives.Popup>
        </ComboBoxPrimitives.Positioner>
      </ComboBoxPrimitives.Portal>

      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </ComboBoxPrimitives.Root>
  );
};

ComboBox.propTypes = {
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  optionKey: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  renderTrigger: PropTypes.func,
  renderOption: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectOpen: PropTypes.func,
  onSearchChange: PropTypes.func,
  showSearch: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isDisabled: PropTypes.bool,
  showClearBtn: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  optionClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  popupClassName: PropTypes.string,
  clearBtnClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};

// 📚 Example:

// import { ComboBox } from "@turtle-ui/components";
// import { useState } from "react";

// const COUNTRIES = [
//   { code: "af", value: "afghanistan", label: "Afghanistan", continent: "Asia" },
//   { code: "al", value: "albania", label: "Albania", continent: "Europe" },
//   { code: "dz", value: "algeria", label: "Algeria", continent: "Africa" },
//   { code: "ad", value: "andorra", label: "Andorra", continent: "Europe" },
//   { code: "ao", value: "angola", label: "Angola", continent: "Africa" },
// ];

// const ComboBoxExample = () => {
//   const [selected, setSelected] = useState(null);

//   return (
//     <div className="flex flex-col items-start gap-1 p-5">
//       <div className="shrink-0 w-[400px] border p-1">
//         <ComboBox
//           options={COUNTRIES}
//           labelKey="label"
//           valueKey="value"
//           optionKey="code"
//           label="Country"
//           placeholder="Select country"
//           //
//           onSelect={setSelected}
//           selectedOption={selected}
//           onSelectOpen={() => {
//             console.log("select opeend");
//           }}
//           onSearchChange={(val) => {
//             console.log("value", val);
//           }}
//           renderOption={(value) => {
//             // render your option componenet here
//           }}
//         />
//       </div>

//     </div>
//   );
// };
