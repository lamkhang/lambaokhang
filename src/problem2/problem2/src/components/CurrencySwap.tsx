import React, { useEffect, useState } from "react";
import FormDropdown from "./Select";
import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputText from "./Input";

const CurrencySwap = () => {
  const [currencies, setCurrencies] = useState<Array<any>>([]);
  const [amountReceive, setAmountReceive] = useState(0);

  const validationSchema = Yup.object().shape({
    currencySend: Yup.string().required("Please choose currency to send"),
    currencyReceive: Yup.string().required("Please choose currency to receive"),
    amountSend: Yup.string().required("please type amount to send"),
  });

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      currencySend: "",
      currencyReceive: "",
      amountSend: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    watch,
    setValue,
  } = methods;

  const onSubmit = (data: any) => {
    const priceSend = currencies.find(({currency}) => currency === data?.currencySend)?.price;
    const priceReceive = currencies.find(({currency}) => currency === data?.currencyReceive)?.price;
    console.log(priceSend)
    console.log(priceReceive)
    console.log(data?.amountSend)
    setAmountReceive(+data?.amountSend *priceReceive /priceSend)
  };

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((result) => {
        return result.json();
      })
      .then((data) => setCurrencies(data));
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-[700px] px-[16px] mt-[100px]">
          <h2 className="text-center text-2xl font-bold">Swap</h2>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <FormDropdown
              name="currencySend"
              options={
                currencies?.map(({ currency }) => ({
                  label: currency,
                  value: currency,
                  icon :`/token/${currency}.svg`
                })) || []
              }
              label="Currency to send"
              placeholder="Choose currency to send"
              isSearch
            />
            <FormDropdown
              name="currencyReceive"
              options={
                currencies?.map(({ currency }) => ({
                  label: currency,
                  value: currency,
                  icon :`/token/${currency}.svg`
                })) || []
              }
              label="Currency to send"
              placeholder="Choose currency to receive"
              isSearch
            />
            <InputText
              name="amountSend"
              label="Amount to send"
              placeholder="Amount to send"
              type="numeric"
            />
            <button className="col-span-2" type="submit">
              <span className="button_top "> Confirm Swap</span>
            </button>
          </div>
          <h2 className="font-bold text-2xl mt-4 text-h2">Amount to receive: {amountReceive.toFixed(2)}</h2>
        </div>
      </form>
    </FormProvider>
  );
};

export default CurrencySwap;
