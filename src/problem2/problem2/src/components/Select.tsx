import { get, isEmpty } from "lodash-es";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// import { useClickAway } from "react-use";

export interface FormDropdownProps {
  name: string;
  options: Array<any>;
  label?: string;
  keyOfLabel?: string;
  keyOfValue?: string;
  isSearch?: boolean;
  placeholder?: string;
}
const FormDropdown: React.FC<FormDropdownProps> = ({
  name,
  options,
  label,
  keyOfLabel,
  keyOfValue,
  isSearch,
  placeholder,
}) => {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
    watch,
  } = useFormContext();

  const [valueDropdown, setValueDropdown] = useState();
  const [isExpand, setIsExpand] = useState(false);

  const ref = useRef(null);

  const keyOfLabelOption = keyOfLabel || "label";
  const keyOfValueOption = keyOfValue || "value";

  const [filter, setFilter] = useState("");

  const optionListFilter = options.filter((option) => {
    if (!filter || !isSearch) return true;

    return option?.[keyOfLabelOption]
      .toLowerCase()
      .includes(filter.toLowerCase());
  });

  const onItemSelected = (item?: any) => {
    setIsExpand(false);
    setValueDropdown(item);
    isSearch && setFilter(item[keyOfLabelOption]);
  };

  const onOpenSelect = useCallback(() => {
    setIsExpand(!isExpand);
  }, [isExpand]);

  // useClickAway(ref, () => {
  //   setIsExpand(false);

  //   if (
  //     isSearch &&
  //     valueDropdown &&
  //     filter !== valueDropdown?.[keyOfLabelOption]
  //   ) {
  //     setFilter(valueDropdown[keyOfLabelOption]);
  //   }
  // });

  useEffect(() => {
    const valueProps = getValues(name);

    if (valueProps && options?.length) {
      const option = options?.find(
        (option) => option?.[keyOfValueOption] === valueProps
      );

      if (option) {
        setValueDropdown(option);
        setFilter(option[keyOfValueOption]);
      }
    }
  }, [getValues(name)]);

  getValues(name);

  return (
    <div>
      <div className="mb-[8px]">
        <span className="text-body-medium font-medium text-on-surface-dark-high-emphasis">
          {label}
        </span>
      </div>
      <div className="relative" ref={ref}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <div
                onClick={onOpenSelect}
                className="flex w-full appearance-none items-center justify-between rounded-[4px] border border-slate-300 bg-white py-[10px] px-[12px] text-left outline-primary hover:shadow-XSmall"
              >
                {isSearch ? (
                  <input
                    value={filter || ""}
                    onChange={(e) => setFilter(String(e.target.value))}
                    className="w-full outline-none"
                    placeholder={placeholder}
                    type="text"
                  />
                ) : (
                  <span
                    className={`text-on-surface-dark-${
                      valueDropdown?.[keyOfLabelOption] ? "high" : "low"
                    }-emphasis`}
                  >
                    {valueDropdown?.[keyOfLabelOption] || placeholder}
                  </span>
                )}
                <div
                  className={` w-[18px] transition-all ${
                    isExpand ? "rotate-180" : ""
                  }`}
                >
                  <img
                    src="/images/dropdown_arrow_down.png"
                    loading="lazy"
                    alt=""
                  />
                </div>
              </div>
              {isExpand && (
                <div className="absolute top-full left-0 z-20 mt-[4px] w-full">
                  <div className="mb-[32px] rounded-[4px] border border-slate-200 bg-white ">
                    <div className="max-h-[175px] overflow-auto p-[10px]">
                      {!isEmpty(optionListFilter) ? (
                        optionListFilter.map((item, index) => (
                          <button
                            key={
                              (keyOfValueOption ? item[keyOfValueOption] : "") +
                              "-" +
                              index
                            }
                            type="button"
                            onClick={(e) => {
                              onItemSelected(item);
                              field?.onChange(item[keyOfValueOption]);
                            }}
                            className={`flex w-full appearance-none items-center gap-3 border-b px-[10px] py-[10px] text-left  hover:bg-slate-400 [&:last-child]:border-none ${
                              item?.[keyOfValueOption] ===
                              valueDropdown?.[keyOfValueOption]
                                ? "bg-[#f0f1f2]"
                                : ""
                            } `}
                          >
                            {item?.icon ? (
                              <div className="shrink-0">
                                <img width={18} src={item?.icon} alt="" />
                              </div>
                            ) : null}
                            <div>
                              {item[keyOfLabelOption]}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center">No results found</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        />
      </div>
      {errors?.[name] ? (
        <div className="mt-[4px] text-red-400">
          {get(errors, [name, "message"])}
        </div>
      ) : null}
    </div>
  );
};

export default FormDropdown;
