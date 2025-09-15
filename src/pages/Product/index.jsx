// Product.js
import Header from "../../components/Header";
import { useState } from "react";
import api from "../../config";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [name, setNameProduct] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  
  async function handleUserSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", parseFloat(price));
      formData.append("image", image);

      await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produto criado com sucesso!");
      setNameProduct('');
      setPrice('');
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto!");
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // cria prévia da imagem
    } else {
      setPreview(null);
    }
  }

  return (
    <>
      <Header />
      <form id="user-form" onSubmit={handleUserSubmit}>
        <label>
          <input
            type="text"
            placeholder="Nome do Produto"
            value={name}
            onChange={(e) => setNameProduct(e.target.value)}
            required
          />
        </label>

        <label>
          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        {/* Quadrado estilizado */}
        <div className="file-upload">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
          <label htmlFor="fileInput" className="file-label">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-img" />
            ) : (
              <span>+</span>
            )}
          </label>
        </div>

        <button type="submit">Criar Produto</button>
      </form>
    </>
  );
};

export default Product;
