import React, { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductEdit = ({
  titleEditForm = "Редактирование",
  editObject = {},
  readOnly = [],
  onSaveEdit,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(editObject);
  const [debugContent, setDebugContent] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEdit(formData);
  };

  return (
    <div className="container">
      <div className="content">
        <h2>{titleEditForm}</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key}:</label>
              <input
                type="text"
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                disabled={readOnly.includes(key)}
              />
            </div>
          ))}
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mb: 1 }}
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate(-1)}
            >
              Отмена
            </Button>
          </div>
        </form>
        <div className="twa-footer-debug">
          <div className="twa-footer-debug__content">{debugContent}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
