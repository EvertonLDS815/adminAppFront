// Product.js
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import api from "../../config";
import FormatCurrency from "../../utils/FormatCurrency";
import './style.css';

const Product = () => {
  const [name, setNameProduct] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // 👇 coloca a função fora do useEffect
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  async function handleUserSubmit(event) {
    event.preventDefault();

    if (!name || !price || !image) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", parseFloat(price));
      formData.append("image", image);

      await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNameProduct('');
      setPrice('');
      setImage(null);
      setPreview(null);

      // 👇 atualiza a lista de produtos logo após salvar
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto!");
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
    setImage(file);
    setPreview(URL.createObjectURL(file)); // cria prévia da nova imagem
    }
    event.target.value = "";
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleProductDelete(productId) {
    try {
      await api.delete(`/product/${productId}`);
      // Atualiza a lista de produtos após a exclusão
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar produto!");
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
          />
        </label>

        <label>
          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

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

      <ul className="list">
        {products.map((product) => (
          <li key={product._id} className="list-item-products">
            <h3>{product.name}</h3>
            <img
                className="image-product"
                src={product.imageURL}
                alt={product.name}
            />
            <div className="contents">
              <h4>{FormatCurrency(product.price)}</h4>
              <button onClick={() => handleProductDelete(product._id)} style={{backgroundColor: '#ff5000'}}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Product;
