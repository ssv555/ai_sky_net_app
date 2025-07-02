import React, { useState } from "react";
import Button from "../ui/Button";
import FooterNav from "../ui/FooterNav";

const ProductEdit = (props) => {
  const {
    object_edit = {},
    onSaveEdit,
    read_only = [],
    titles = {},
    backPage = "/ProductsForm",
  } = props;
  const page_title = props.pageTitle || "Редактирование";
  const [formState, setFormState] = useState(object_edit || {});

  const isChanged =
    formState && object_edit && Object.keys(formState).length > 0
      ? Object.keys(formState).some(
          (key) =>
            !read_only.includes(key) && formState[key] !== object_edit[key]
        )
      : false;

  const handleChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSaveEdit && isChanged) onSaveEdit({ ...object_edit, ...formState });
  };

  if (!formState || Object.keys(formState).length === 0) {
    return <div>Товар не найден или загрузка...</div>;
  }

  return (
    <div className="twa-container">
      <div className="twa-header-content-edit">
        <h1 className="twa-title">{page_title}</h1>
        <div className="twa-controls-container-edit">
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
                <label className="twa-edit-label">{titles[key] || key}</label>
                <input
                  className={`twa-edit-input${
                    read_only.includes(key) ? " twa-edit-input--readonly" : ""
                  }`}
                  type="text"
                  value={value ?? ""}
                  readOnly={read_only.includes(key)}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
          </form>
        </div>
        <div className="twa-footer-debug"></div>
      </div>
      <FooterNav backRoute={backPage} />
    </div>
  );
};

export default ProductEdit;
