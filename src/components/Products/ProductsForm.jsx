import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import apiProducts from "../../services/apiProducts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";
import Table from "../ui/Table";

const ProductsForm = () => {
  const {
    WebApp,
    MainButton,
    user,
    sendDataToServer,
    isDevMode,
    CHAT_ID,
    BOT_USERNAME,
  } = useTelegram();
  const tg_user_id = user?.id;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedReportType, setSelectedReportType] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const REFRESH_COOLDOWN = 3000; // 5 секунд в миллисекундах

  const reportTypes = [
    { value: 0, label: "Товары за день" },
    { value: 1, label: "Сумма за месяц по дням" },
    { value: 2, label: "Сумма за год по месяцам" },
  ];

  // Конфигурация колонок для таблицы
  const tableColumns = useMemo(() => {
    switch (selectedReportType) {
      case 0: // Товары за день
        return [
          { key: "product_id", title: "ID", width: "5%" },
          { key: "product", title: "Товар", width: "25%" },
          {
            key: "cost",
            title: "Цена",
            width: "15%",
            align: "right",
            render: (value) => `${value?.toLocaleString() || 0} ₽`,
          },
          {
            key: "type_sell_name",
            title: "Тип оплаты",
            width: "10%",
          },
          {
            key: "payer",
            title: "Оплатил",
            width: "20%",
          },
          {
            key: "datetime_ins",
            title: "Дата",
            width: "20%",
          },
        ];
      case 1: // Сумма за месяц по дням
      case 2: // Сумма за год по месяцам
        return [
          { key: "date", title: "Дата", width: "10%", align: "center" },
          { key: "total_items", title: "Кол-во", width: "10%", align: "right" },
          {
            key: "total_cost",
            title: "Сумма",
            width: "40%",
            align: "right",
            render: (value) => `${value?.toLocaleString() || 0} ₽`,
          },
        ];
      default:
        return [];
    }
  }, [selectedReportType]);

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("Обновление заблокировано - слишком частое нажатие");
      return;
    }
    setLastRefreshTime(now);
    setIsRefreshDisabled(true);
    setIsLoading(true);
    console.log("Обновление данных...");

    try {
      let response;
      const dateStr = selectedDate.toISOString().split("T")[0];
      // Debug
      const user_id = tg_user_id || 1264828537;
      console.log(
        `user_id: ${user_id}, dateStr: ${dateStr}, selectedReportType: ${selectedReportType}`
      );

      switch (selectedReportType) {
        case 0:
          response = await apiProducts.getProducts(user_id, dateStr);
          break;
        case 1:
          response = await apiProducts.getSumMonByDays(user_id, dateStr);
          break;
        case 2:
          response = await apiProducts.getSumMon(user_id, dateStr);
          break;
        default:
          response = { data: [] };
      }

      setProductsData(response.data || []);
      console.log("Данные получены:", response.data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setProductsData([]);
      if (WebApp) {
        WebApp.showAlert("Ошибка при загрузке данных");
      }
    } finally {
      setIsLoading(false);
    }

    // Разблокируем кнопку через 5 секунд
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, REFRESH_COOLDOWN);
  }, [lastRefreshTime, selectedReportType, selectedDate, tg_user_id, WebApp]);

  const handleRowClick = useCallback((row, index) => {
    console.log("Клик по строке:", row, index);
    // Здесь можно добавить логику для обработки клика по строке
  }, []);

  // Автоматическая загрузка данных при изменении параметров
  useEffect(() => {
    handleRefresh();
  }, [selectedReportType, selectedDate, tg_user_id, WebApp]);

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Товары</h1>

        <div className="twa-header-content">
          <div className="twa-datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="twa-datepicker"
              placeholderText="Выберите дату"
            />
          </div>
          <div className="twa-report-type-container">
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(Number(e.target.value))}
              className="twa-select"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="twa-refresh-button-container">
            <Button
              name="refresh"
              title="Обновить"
              variant="primary"
              enabled={!isRefreshDisabled}
              onClick={handleRefresh}
            />
          </div>
        </div>

        <div className="twa-content">
          <Table
            columns={tableColumns}
            data={productsData}
            onRowClick={handleRowClick}
            isLoading={isLoading}
          />
        </div>

        <div className="twa-footer-debug"></div>
      </div>
    </div>
  );
};

export default ProductsForm;

// <div className="twa-form"></div>
