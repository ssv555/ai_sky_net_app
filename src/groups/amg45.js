export const isAmg45Group = (CHAT_ID, BOT_USERNAME) => {
  if (CHAT_ID === undefined || CHAT_ID === 0) return true;

  if (BOT_USERNAME === undefined || BOT_USERNAME === "ssv_test_bot")
    return true;
  return amg45Groups.some((group) => group.group_id === CHAT_ID);
};

const amg45Groups = [
  {
    group_id: 1264828537,
    group_name: "ssv_test_bot",
  },
  {
    group_id: 1, // TODO: Добавить реальный id группы.
    group_name: "AMG 45 RUS",
  },
];

export const setAmg45Model = (filteredModels, setCarData) => {
  const model_117 = filteredModels.find(
    (model) => model.model_code === "117.352"
  );
  if (model_117) {
    setCarData((prev) => ({
      ...prev,
      car_model_id: model_117.car_model_id,
    }));
  }
};

export const handleModelSelection = (model, setCarData) => {
  if (!model) return;

  const partialVin = `WDD${model.model_code.replace(".", "")}`;
  setCarData((prev) => ({
    ...prev,
    vin: partialVin,
  }));

  if (model.model_name.includes("AMG")) {
    setCarData((prev) => ({
      ...prev,
      fuel_type: "Бензин",
      transmission: "Робот",
    }));
  }

  // Устанавливаем фокус на поле VIN
  setTimeout(() => {
    const vinInput = document.querySelector('input[name="vin"]');
    if (vinInput) {
      vinInput.focus();
      vinInput.setSelectionRange(partialVin.length, partialVin.length);
    }
  }, 0);
};

export const handleEnginePower = (model, year, setCarData) => {
  if (!model || !model.model_code.includes("117")) return;

  let set_horsepower = 360;
  if (year >= 2013 && year < 2016) {
    set_horsepower = 360;
  } else if (year >= 2016 && year < 2020) {
    set_horsepower = 381;
  } else {
    set_horsepower = 421;
  }

  setCarData((prev) => ({
    ...prev,
    horsepower: set_horsepower,
    engine_size: 2,
  }));
};

export const setMercedesBrand = (brands, setCarData) => {
  const mercedes = brands.find((brand) => brand.name === "Mercedes-Benz");
  console.log("I AM INSIDE - 1", brands);
  if (mercedes) {
    console.log("I AM INSIDE - 2");
    setCarData((prev) => ({
      ...prev,
      car_brand_id: mercedes.car_brand_id,
    }));
  }
};
