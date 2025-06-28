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
    showNotification,
    isTelegramEnvironment,
  } = useTelegram();
  const tg_user_id = user?.id || (isDevMode() === true ? 1264828537 : null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedReportType, setSelectedReportType] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const REFRESH_COOLDOWN = 2000; // в миллисекундах

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
    setIsLoading(true);
    console.log("Обновление данных...");

    try {
      let resData; // Данные
      let resTotal; // Итоги
      const dateStr = selectedDate.toISOString().split("T")[0];

      switch (selectedReportType) {
        case 0:
          resData = await apiProducts.getDay(tg_user_id, dateStr);
          resTotal = await apiProducts.getDaySum(tg_user_id, dateStr);
          break;
        case 1:
          resData = await apiProducts.getMonth(tg_user_id, dateStr);
          resTotal = await apiProducts.getMonthSum(tg_user_id, dateStr);
          break;
        case 2:
          resData = await apiProducts.getYear(tg_user_id, dateStr);
          resTotal = await apiProducts.getYearSum(tg_user_id, dateStr);
          break;
        default:
          return;
      }

      // Правильно обрабатываем данные в зависимости от структуры ответа
      const dataArray = Array.isArray(resData)
        ? resData
        : resData?.data && Array.isArray(resData.data)
        ? resData.data
        : resData?.items && Array.isArray(resData.items)
        ? resData.items
        : [];

      const totalData = resTotal?.data?.[0] || resTotal || {};

      setProductsData(dataArray);
      setTotalCount(totalData.total_items || 0);
      setTotalSum(totalData.total_cost || 0);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        console.log("Разблокируем кнопку обновления...");
        setIsRefreshDisabled(false);
      }, REFRESH_COOLDOWN);
    }
  }, [selectedDate, selectedReportType, tg_user_id]);

  // Функция для генерации CSV контента
  const generateCSVContent = useCallback(() => {
    if (
      !productsData ||
      !Array.isArray(productsData) ||
      productsData.length === 0
    ) {
      return null;
    }

    // Создаем заголовки CSV
    const csvSeparator = ";";
    const headers = tableColumns.map((col) => col.title).join(csvSeparator);

    // Создаем строки данных
    const rows = productsData.map((item) => {
      return tableColumns
        .map((col) => {
          let value = item[col.key];

          // Применяем рендер функцию если есть
          if (col.render) {
            value = col.render(value);
          }

          // Экранируем запятые и кавычки в значениях
          if (
            typeof value === "string" &&
            (value.includes(csvSeparator) || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          return value || "";
        })
        .join(csvSeparator);
    });

    // Объединяем заголовки и данные
    return [headers, ...rows].join("\n");
  }, [productsData, tableColumns]);

  const handleCopyTable = useCallback(async () => {
    const csvContent = generateCSVContent();
    if (!csvContent) {
      console.log("Нет данных для копирования");
      showNotification("Нет данных для копирования", "info");
      return;
    }

    try {
      await navigator.clipboard.writeText(csvContent); // Копируем в буфер обмена
      console.log("Данные скопированы в буфер обмена");
      showNotification("Данные скопированы в буфер обмена", "success"); // Показываем уведомление пользователю
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      showNotification("Ошибка при копировании данных", "error");
    }
  }, [generateCSVContent, showNotification]);

  const handleCopyTotal = useCallback(async () => {
    let csvContent = generateCSVContent();
    if (!csvContent) {
      console.log("Нет данных для копирования");
      showNotification("Нет данных для копирования", "info");
      return;
    }
    csvContent += `\nКол-во;${totalCount};Итого;${totalSum}`;

    try {
      await navigator.clipboard.writeText(csvContent); // Копируем в буфер обмена
      console.log("Данные скопированы в буфер обмена");
      showNotification("Данные скопированы в буфер обмена", "success"); // Показываем уведомление пользователю
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      showNotification("Ошибка при копировании данных", "error");
    }
  }, [generateCSVContent, showNotification]);

  const handleDropdownItemClick = useCallback(
    (item) => {
      switch (item.action) {
        case "copyTable":
          handleCopyTable();
          break;
        case "copyTotal":
          handleCopyTotal();
          break;
        default:
          break;
      }
    },
    [handleCopyTable, handleCopyTotal]
  );

  const copyDropdownItems = [
    { label: "Таблица", action: "copyTable" },
    { label: "Таблица + Итог", action: "copyTotal" },
  ];

  const handleRowClick = useCallback((row, index) => {
    console.log("Клик по строке:", row, index);
    // Здесь можно добавить логику для обработки клика по строке
  }, []);

  // Автоматическая загрузка данных только при изменении пользователя
  useEffect(() => {
    if (tg_user_id) {
      handleRefresh();
    }
  }, [tg_user_id]);

  // Автоматическое обновление при изменении даты или типа отчета
  useEffect(() => {
    if (tg_user_id && !isRefreshDisabled) {
      const timer = setTimeout(() => {
        handleRefresh();
      }, 300); // Небольшая задержка для избежания частых запросов
      return () => clearTimeout(timer);
    }
  }, [selectedDate, selectedReportType, handleRefresh]);

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Товары</h1>

        {/* Отладочная информация */}
        <div style={{ fontSize: "10px", color: "#666", marginBottom: "10px" }}>
          isRefreshDisabled: {isRefreshDisabled.toString()}, isLoading:{" "}
          {isLoading.toString()}
        </div>

        <div className="twa-header-content">
          <div className="twa-datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="twa-datepicker"
              placeholderText="Выберите дату"
              disabled={isRefreshDisabled}
            />
          </div>
          <div className="twa-report-type-container">
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(Number(e.target.value))}
              className="twa-select"
              disabled={isRefreshDisabled}
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
              title="🔄 Обновить"
              variant="primary"
              enabled={!isRefreshDisabled}
              onClick={handleRefresh}
            />
            <Button
              name="copy"
              title="📋 Копировать"
              variant="secondary"
              enabled={
                Array.isArray(productsData) &&
                productsData.length > 0 &&
                !isRefreshDisabled
              }
              dropdownItems={copyDropdownItems}
              onDropdownItemClick={handleDropdownItemClick}
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
