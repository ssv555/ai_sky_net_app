import React, { useState } from "react";
import "./ProductsForm.css";
import Button from "../ui/Button";
import FooterNav from "../ui/FooterNav";
import { useNavigate } from "react-router-dom";

const ProductEdit = ({
  titleEditForm = "Редактирование",
  editObject = {},
  readOnly = [],
  onSaveEdit,
}) => {
  const [formState, setFormState] = useState(editObject);

  // Проверка изменений только по редактируемым полям
  const isChanged = Object.keys(formState).some(
    (key) => !readOnly.includes(key) && formState[key] !== editObject[key]
  );

  const handleChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSaveEdit && isChanged) onSaveEdit(formState);
  };

  return (
    <div className="twa-container">
      <div className="twa-header-content">
        <h1 className="twa-title">{titleEditForm}</h1>
        <div className="twa-controls-container">
          <Button
            name="save"
            title="💾 Сохранить"
            variant="secondary"
            onClick={handleSave}
            enabled={isChanged}
          />
        </div>
      </div>
      <div className="twa-page">
        <div className="twa-content">
          <form
            className="twa-edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {Object.entries(formState).map(([key, value]) => (
              <div key={key} className="twa-edit-row">
                <label className="twa-edit-label">{key}</label>
                <input
                  className="twa-edit-input"
                  type="text"
                  value={value ?? ""}
                  readOnly={readOnly.includes(key)}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
          </form>
        </div>
        <div className="twa-footer-debug"></div>
      </div>
      <FooterNav />
    </div>
  );
};

export default ProductEdit;
