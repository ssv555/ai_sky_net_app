import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import apiProducts from "../../services/apiProducts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";

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

  const REFRESH_COOLDOWN = 5000; // 5 секунд в миллисекундах

  const reportTypes = [
    { value: 0, label: "Товары за день" },
    { value: 1, label: "Сумма за месяц по дням" },
    { value: 2, label: "Сумма за год по месяцам" },
  ];

  const handleRefresh = useCallback(() => {
    const now = Date.now();

    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("Обновление заблокировано - слишком частое нажатие");
      return;
    }
    setLastRefreshTime(now);
    setIsRefreshDisabled(true);
    console.log("Обновление данных...");

    // Логика получения данных.
    if (selectedReportType === 0) {
      console.log(`tg_user_id: ${tg_user_id}, selectedDate: ${selectedDate}`);
      apiProducts.getProducts(tg_user_id, selectedDate);
    }

    // Разблокируем кнопку через 5 секунд
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, REFRESH_COOLDOWN);
  }, [lastRefreshTime]);

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

        <div className="twa-content"></div>

        <div className="twa-footer-debug"></div>
      </div>
    </div>
  );
};

export default ProductsForm;

// <div className="twa-form"></div>
