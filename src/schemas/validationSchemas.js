import * as yup from 'yup';

export const productSchema = yup.object().shape({
  product: yup.string().required('Введите название товара'),
  cost: yup.number().required('Введите цену').min(0, 'Цена не может быть отрицательной'),
  type_sell: yup.string().required('Выберите тип оплаты'),
  payer: yup.string().required('Укажите плательщика')
});

export const carSchema = yup.object().shape({
  car_brand_id: yup.string().required('Выберите бренд'),
  car_model_id: yup.string().required('Выберите модель'),
  year: yup.number().required('Выберите год выпуска'),
  vin: yup.string().required('Введите VIN код').max(256, 'VIN код слишком длинный'),
  reg_number: yup.string().required('Введите регистрационный номер').max(256, 'Регистрационный номер слишком длинный'),
  engine_size: yup.number().min(0, 'Объем не может быть отрицательным').max(20, 'Слишком большой объем'),
  horsepower: yup.number().min(0, 'Мощность не может быть отрицательной').max(2000, 'Слишком большая мощность'),
  buy_price: yup.number().min(0, 'Цена не может быть отрицательной').max(1000000000, 'Слишком высокая цена'),
  buy_mileage: yup.number().min(0, 'Пробег не может быть отрицательным')
});