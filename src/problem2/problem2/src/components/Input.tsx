import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { get } from "lodash-es";

export type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  placeholder?: string;
  inputMode?:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal";
  type?: string;
  disabled?: boolean;
  isRequired?: boolean;
  keysFilter?: string[];
};
const InputText: React.FC<InputTextProps> = ({
  name,
  label,
  inputMode,
  isRequired,
  type,
  disabled,
  onChange,
  onBlur,
  keysFilter,
  placeholder,
  ...otherProps
}) => {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useFormContext();

  return (
    <div>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <span className="font-medium">{label}</span>
              <input
                {...field}
                value={field?.value?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                onChange={(event) => {
                  const { value } = event.target;
                  const _value = value.replaceAll(".", "");
                  const _event = {
                    ...event,
                    target: { ...event.target, value: _value },
                  };

                  if (type === "numeric") {
                    if (
                      _value === "" ||
                      /^[0-9\b]+$/.test(_value)
                    ) {
                      field?.onChange(_event);
                    }
                    return;
                  }
                  field?.onChange(_event);
                }}
                className="block w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
              {errors?.[name] ? (
                <div className="mt-[4px] text-body-small text-red-400">
                  {get(errors, [name, "message"])}
                </div>
              ) : null}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default InputText;
