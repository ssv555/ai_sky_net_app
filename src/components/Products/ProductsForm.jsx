import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import apiProducts from "../../services/apiProducts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";
import Table from "../ui/Table";
import "./ProductsForm.css";

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
  const [isControlsDisabled, setIsControlsDisabled] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const REFRESH_COOLDOWN = 3000; // 5 секунд в миллисекундах

  const reportTypes = [
    { value: 0, label: "Товары за день" },
    { value: 1, label: "Сумма за месяц" },
    { value: 2, label: "Сумма за год" },
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
            render: (value) =>
              `${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`,
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
      case 1: // Сумма за месяц
      case 2: // Сумма за год
        return [
          { key: "date", title: "Дата", width: "10%", align: "center" },
          { key: "total_items", title: "Кол-во", width: "10%", align: "right" },
          {
            key: "total_cost",
            title: "Сумма",
            width: "40%",
            align: "right",
            render: (value) =>
              `${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`,
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
    setIsControlsDisabled(true);
    setIsLoading(true);
    console.log("Обновление данных...");

    try {
      let resData; // Данные
      let resTotal; // Итоги
      const dateStr = selectedDate.toISOString().split("T")[0];

      const user_id = tg_user_id || (isDevMode() === true ? 1264828537 : null);
      console.log(
        `user_id: ${user_id}, dateStr: ${dateStr}, selectedReportType: ${selectedReportType}`
      );

      switch (selectedReportType) {
        case 0:
          resData = await apiProducts.getDay(user_id, dateStr);
          resTotal = await apiProducts.getDaySum(user_id, dateStr);
          break;
        case 1:
          resData = await apiProducts.getMonth(user_id, dateStr);
          resTotal = await apiProducts.getMonthSum(user_id, dateStr);
          break;
        case 2:
          resData = await apiProducts.getYear(user_id, dateStr);
          resTotal = await apiProducts.getYearSum(user_id, dateStr);
          break;
        default:
          resData = { data: [] };
      }

      setProductsData(resData.data || []);

      // Обновляем тестовые данные для количества и суммы
      // console.log(`resTotal:`, resTotal);
      setTotalCount(resTotal.data[0]?.total_items || 0);
      setTotalSum(resTotal.data[0]?.total_cost || 0);

      console.log("Данные получены:", resData.data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setProductsData([]);
      setTotalCount(0);
      setTotalSum(0);
      if (WebApp) {
        WebApp.showAlert("Ошибка при загрузке данных");
      }
    } finally {
      setIsLoading(false);
    }

    // Разблокируем кнопку через 5 секунд
    setTimeout(() => {
      setIsRefreshDisabled(false);
      setIsControlsDisabled(false);
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
              disabled={isControlsDisabled}
            />
          </div>
          <div className="twa-report-type-container">
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(Number(e.target.value))}
              className="twa-select"
              disabled={isControlsDisabled}
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

        <div className="twa-summary-container">
          <div className="twa-summary-item">
            <span className="twa-summary-label">Кол-во:</span>
            <span className="twa-summary-value">{totalCount}</span>
          </div>
          <div className="twa-summary-item">
            <span className="twa-summary-label">Итого:</span>
            <span className="twa-summary-value total">
              {totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
            </span>
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
