import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./ProductsForm.css";
import { useTelegram, useApplyTelegramTheme } from "../../hooks/useTelegram";
import apiProducts from "../../services/apiProducts";
import DatePicker from "react-datepicker";
import Button from "../ui/Button";
import Table from "../ui/Table";
import { showConfirmation } from "../../utils/telegramUtils";
import FooterNav from "../ui/FooterNav";
import ProductEdit from "./ProductEdit";

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
  useApplyTelegramTheme();
  let lastRefreshTime = 0;
  let isRefreshDisabled = false;
  const REFRESH_COOLDOWN = 3000; // в миллисекундах
  const tg_user_id = user?.id; // || (isDevMode() === true ? 1264828537 : null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedReportType, setSelectedReportType] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editObject, setEditObject] = useState(null);

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
    if (!tg_user_id || isRefreshDisabled) {
      console.log("isRefreshDisabled:", isRefreshDisabled);
      console.log("tg_user_id:", tg_user_id);
      return;
    }

    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("Обновление заблокировано - слишком частое обновление.");
      return;
    }

    lastRefreshTime = now;
    isRefreshDisabled = true;
    setIsLoading(true);
    setSelectedRows([]); // Очищаем выбранные строки при обновлении
    console.log(
      `${new Date(now).toISOString().replace("T", " ").replace("Z", "")}`,
      "Обновление данных..."
    );

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
        isRefreshDisabled = false;
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

  // Копирование только выделенных строк (красиво)
  const handleCopyRecords = useCallback(async () => {
    if (!selectedRows || selectedRows.length === 0) {
      showNotification("Выделите строку для копирования", "info");
      return;
    }
    if (!productsData || productsData.length === 0) {
      showNotification("Нет данных для копирования", "info");
      return;
    }
    const csvSeparator = ";";
    const headers = tableColumns.map((col) => col.title).join(csvSeparator);
    const rows = selectedRows
      .map((id) => {
        const row = productsData.find((item) => item.product_id === id);
        if (!row) return null;
        return tableColumns
          .map((col) => {
            let value = row[col.key];
            if (col.render) value = col.render(value);
            if (
              typeof value === "string" &&
              (value.includes(csvSeparator) || value.includes('"'))
            ) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(csvSeparator);
      })
      .filter(Boolean);
    if (rows.length === 0) {
      showNotification("Строки не найдены", "error");
      return;
    }
    const result = [headers, ...rows].join("\n");
    try {
      await navigator.clipboard.writeText(result);
      showNotification(`Скопировано строк: ${rows.length}`, "success");
    } catch (error) {
      showNotification("Ошибка копирования", "error");
    }
  }, [selectedRows, productsData, tableColumns, showNotification]);

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

  const handleDownloadCSV = useCallback(async () => {
    const csvContent = generateCSVContent();
    if (!csvContent) {
      console.log("Нет данных для скачивания");
      showNotification("Нет данных для скачивания", "info");
      return;
    }

    try {
      // Добавляем итоговую строку
      const fullContent =
        csvContent + `\nКол-во;${totalCount};Итого;${totalSum}`;

      // Создаем Blob с BOM для корректного отображения кириллицы в Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + fullContent], {
        type: "text/csv;charset=utf-8;",
      });

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Формируем имя файла с датой
      const dateStr = selectedDate.toISOString().split("T")[0];
      const reportTypeNames = ["day", "month", "year"];
      const fileName = `products_${reportTypeNames[selectedReportType]}_${dateStr}.csv`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Файл CSV скачан");
      showNotification("Файл CSV скачан", "success");
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
      showNotification("Ошибка при скачивании файла", "error");
    }
  }, [
    generateCSVContent,
    totalCount,
    totalSum,
    selectedDate,
    selectedReportType,
    showNotification,
  ]);

  const handleDuplicateSelected = useCallback(() => {
    const message = `Дублировать выбранные товары (${selectedRows.length} шт.)?`;
    showConfirmation(message, () => {
      doDuplicateSelected();
    });
  }, [selectedRows, showNotification]);

  const handleEditSelected = useCallback(() => {
    if (selectedRows.length !== 1) {
      showNotification(
        "Для редактирования должна быть выделена одна запись.",
        "info"
      );
      return;
    }
    const objEdit = productsData.find(
      (item) => item.product_id === selectedRows[0]
    );
    setEditObject(objEdit);
    setShowEdit(true);
  }, [selectedRows, productsData, showNotification]);

  const handleSaveEdit = (updatedObject) => {
    // Тут логика сохранения (например, API-запрос)
    setShowEdit(false);
    setEditObject(null);
    showNotification("Изменения сохранены", "success");
    handleRefresh();
  };

  const handleDeleteSelected = useCallback(() => {
    const message = `Удалить выбранные товары (${selectedRows.length} шт.)?`;
    showConfirmation(message, () => {
      doDeleteSelected();
    });
  }, [selectedRows, showNotification]);

  const handleActionItemClick = useCallback(
    (item) => {
      switch (item.action) {
        case "duplicate":
          handleDuplicateSelected();
          break;
        case "edit":
          handleEditSelected();
          break;
        case "delete":
          handleDeleteSelected();
          break;
        case "copyRecord":
          handleCopyRecords();
          break;
        case "copyTable":
          handleCopyTable();
          break;
        case "copyTotal":
          handleCopyTotal();
          break;
        case "downloadCSV":
          handleDownloadCSV();
          break;
        default:
          break;
      }
    },
    [
      handleDuplicateSelected,
      handleEditSelected,
      handleDeleteSelected,
      handleCopyRecords,
      handleCopyTable,
      handleCopyTotal,
      handleDownloadCSV,
      showNotification,
    ]
  );

  const doDuplicateSelected = async () => {
    console.log("Дублирование выбранных строк:", selectedRows);
    const params = { tg_user_id, id: [selectedRows] };
    const resData = await apiProducts.doDuplicate(params);

    if (resData?.success === true) {
      await handleRefresh();
      const productIdsString = resData.data
        .map((item) => item.product_id)
        .join(", ");
      const msg = `Успешное дублирование товаров:\n${productIdsString}`;
      setTimeout(() => {
        showNotification(msg, "info");
      }, 100); // 100 мс достаточно для рендера
    } else {
      console.log("resData:", resData);
      showNotification(resData?.message, "error");
    }
  };

  const doDeleteSelected = async () => {
    console.log("Удаление выбранных строк:", selectedRows);
    const params = { tg_user_id, id: [selectedRows] };
    const resData = await apiProducts.doDelete(params);

    if (resData?.success === true) {
      await handleRefresh();
      const productIdsString = selectedRows.map((item) => item).join(", ");
      const msg = `Успешно удалены:\n${productIdsString}`;
      setTimeout(() => {
        showNotification(msg, "info");
      }, 100); // 100 мс достаточно для рендера
    } else {
      console.log("resData:", resData);
      showNotification(resData?.message, "error");
    }
  };

  const handleRowClick = useCallback(
    (row, index) => {
      // Работаем только при selectedReportType === 0 и наличии данных
      if (
        selectedReportType !== 0 ||
        !productsData ||
        productsData.length === 0
      ) {
        return;
      }

      const productId = row.product_id;
      if (!productId) {
        return;
      }

      setSelectedRows((prev) => {
        const isSelected = prev.includes(productId);
        if (isSelected) {
          // Удаляем из массива
          return prev.filter((id) => id !== productId);
        } else {
          // Добавляем в массив
          return [...prev, productId];
        }
      });
    },
    [selectedReportType, productsData]
  );

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

  const actionDropdownItems = [
    { label: "Буфер обмена - Строка", action: "copyRecord" },
    { label: "Буфер обмена - Таблица", action: "copyTable" },
    { label: "Буфер обмена - Таблица + Итог", action: "copyTotal" },
    { label: "Файл CSV", action: "downloadCSV" },
    { label: "________________________" },
    { label: "Дублировать...", action: "duplicate" },
    { label: "Редактировать...", action: "edit" },
    { label: "Удалить...", action: "delete" },
  ];

  if (showEdit && editObject) {
    return (
      <ProductEdit
        titleEditForm="Редактирование товара"
        editObject={editObject}
        readOnly={["product_id", "tg_user_id", "text", "datetime_ins"]}
        onSaveEdit={handleSaveEdit}
      />
    );
  }

  return (
    <div className="twa-container">
      <div className="twa-header-content">
        <h1 className="twa-title">Товары</h1>
        <div className="twa-controls-container">
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
              variant="secondary"
              enabled={!isRefreshDisabled}
              onClick={handleRefresh}
            />
            <Button
              name="action"
              title="⚡ Действие"
              variant="secondary"
              enabled={
                selectedReportType === 0 &&
                Array.isArray(selectedRows) &&
                selectedRows.length > 0 &&
                !isRefreshDisabled
              }
              dropdownItems={actionDropdownItems}
              onDropdownItemClick={handleActionItemClick}
            />
          </div>
        </div>

        <div className="twa-summary-container">
          <div className="twa-summary-item">
            <span className="twa-summary-label">Кол-во:</span>
            <span className="twa-summary-value">{totalCount}</span>
          </div>
          <div className="twa-summary-item">
            <span className="twa-summary-label">Выделено:</span>
            <span className="twa-summary-value">{selectedRows.length}</span>
          </div>
          <div className="twa-summary-item">
            <span className="twa-summary-label">Итого:</span>
            <span className="twa-summary-value total">
              {totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
            </span>
          </div>
        </div>
      </div>
      <div className="twa-page">
        <div className="twa-content">
          <Table
            columns={tableColumns}
            data={productsData}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            selectedRows={selectedRows}
            enableRowSelection={
              selectedReportType === 0 && productsData.length > 0
            }
          />
        </div>

        <div className="twa-footer-debug"></div>
      </div>
      <FooterNav />
    </div>
  );
};

export default ProductsForm;
