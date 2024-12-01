import { useState, useEffect } from "react";
import Select from 'react-select';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import PriceModal from './PriceModal';
import Modal from 'react-bootstrap/Modal';

import "../css/Product.css";
const PRODUCT_URL = 'products/';

const Product = () => {
  const [products, setProducts] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [companies, setCompanies] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState([]);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [newPriceValue, setNewPriceValue] = useState("");
  const [newPriceCurrency, setNewPriceCurrency] = useState("");

  const [savePrices, setSavedPrices] = useState([]);

  const [saveProduct, setSavedProduct] = useState({
    code: null,
    name: null,
    characteristic: null,
    quantity: null,
    prices: [],
    categories: [],
    companyId: [],
  });

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
    const idCategories = selectedOptions.map((category) => category.value);
    console.log(idCategories, 'idCategories')
    if (idCategories.length > 0) {
      setSavedProduct({...saveProduct, categories: idCategories})
    
    }
    // categories = {

    // }
    console.log(selectedOptions, 'categorasdasasdasdasasdasdasdd')
  };

  const handleAddPrice = () => {
    setShowPriceModal(true);
  };

  const handlePriceModalClose = () => {
    setShowPriceModal(false);
  };
  

  const handleAddPriceModal = (newPrice) => {
    // Do something with the newPrice object
    console.log(newPriceValue);
    const data = {
      value: newPrice.value,
      currencyId: newPrice.selectedCurrency.value
    }
    setSavedPrices(savePrices.push(data))
    setNewPriceValue(`${newPriceValue}  ${newPriceValue ? ` - ${newPrice.value}` : newPrice.value}`);
    setNewPriceCurrency(newPrice.selectedCurrency.label);
    console.log(savePrices)
    setSavedProduct({...saveProduct, prices: savePrices })

    // setNewPriceValue(newPrice.value);
    // setNewPriceCurrency(newPrice.selectedCurrency.label);
  };

  const handleSaveProduct = async (productToSave) => {
    setShowModal(false)
    try {
      console.log(productToSave)
      console.log(saveProduct, "savepr ")
      const response = await axiosPrivate.post(PRODUCT_URL, {...saveProduct, companyId: "363a7a35-7361-4511-bd5b-e740b0bc00f6"});
      console.log(response)
    } catch (err) {
      console.error(err);
    }
  }
  const handleDelete = async (id) => {
    console.log(id);
    if (id){
      const response = axiosPrivate.delete(`${PRODUCT_URL}/${id}`)
      console.log(response)
    }
  }


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCategories = async () => {
      try {
        const response = await axiosPrivate.get('category');
        const categoriesData = response.data;
        setCategories(categoriesData.map((category) => ({ value: category.id, label: category.description })));
      } catch (err) {
        console.error(err);
      }
    };
    const getCompanies = async () => {
      try {
        const response = await axiosPrivate.get('company');
        const categoriesData = response.data;
        setCategories(categoriesData.map((category) => ({ value: category.id, label: category.description })));
      } catch (err) {
        console.error(err);
      }
    };

    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get(PRODUCT_URL,
          {
              headers: { 
                'Content-Type': 'application/json',}
          });


        console.log(response);
        if (response.data.length > 0) {
          const products = response.data.map((data => {
            console.log(data)
            return {
              name: data.name,
              price: data.prices.map((price) => `${price.value} ${price.currency.description}`).join(', '),
              code: data.code,
              characteristics: data.characteristic,
              categories: data.categories.map((category) => category.description).join(', ')
            }
          }))
          console.log(products)
          isMounted && setProducts(products);

        }
      } catch (err) {
        console.error(err);
      }
    };

    getCategories()
    getProducts()

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <section className="product-container">
        <article>
          <h2>Products List</h2>
        </article>
         <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Code</th>
              <th>Characteristics</th>
              <th>Categories</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products?.length ? (
              <>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.code}</td>
                    <td>{product.characteristics}</td>
                    <td>{product.categories}</td>
                    <td>
                      <button onClick={handleDelete(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="6">No products to display</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Product
        </Button>
        <Modal className="modal-lg" show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={saveProduct.name} onChange={(e) => setSavedProduct({...saveProduct, name: e.target.value})} />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <div className="input-group">
                <input disabled type="text" className="form-control" id="price-value" value={newPriceValue} />
                <button className="btn btn-outline-secondary" type="button" onClick={handleAddPrice}>Add Price</button>
              </div>
              {showPriceModal && (
                <PriceModal
                  show={showPriceModal}
                  onClose={handlePriceModalClose}
                  onAddPrice={handleAddPriceModal}
                />
              )}
              <div id="prices">
                {/* Render the existing prices here */}
              </div>
            </div>
            {/* <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="number" className="form-control" id="price" />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Currency</label>
              <Select
                isMulti
                options={categories}
                value={selectedCategories}
                onChange={handleCategoryChange}
              />

            </div> */}
            <div className="mb-3">
              <label htmlFor="code" className="form-label">Code</label>
              <input type="text" className="form-control" id="code"  value={saveProduct.code} onChange={(e) => setSavedProduct({...saveProduct, code: e.target.value})}  />
            </div>
            <div className="mb-3">
              <label htmlFor="characteristics" className="form-label">Characteristics</label>
              <input type="text" className="form-control" id="characteristics" value={saveProduct.characteristic} onChange={(e) => setSavedProduct({...saveProduct, characteristic: e.target.value})} />
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input type="number" className="form-control" id="quantity" value={saveProduct.quantity} onChange={(e) => setSavedProduct({...saveProduct, quantity: e.target.value})} />
            </div>
            <div className="mb-3">

              <label htmlFor="categories" className="form-label">Categories</label>
              <Select
                isMulti
                options={categories}
                value={selectedCategories}
                onChange={handleCategoryChange}
              />
            </div>
            {/* <div className="mb-3">

              <label htmlFor="companies" className="form-label">Company</label>
              <Select
                isMulti
                options={companies}
                value={selectedCompany}
                onChange={handleCompanyChange}
              />
            </div> */}
          </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSaveProduct({saveProduct})}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {showPriceModal && (
          <div className="overlay" onClick={(e) => e.target === e.currentTarget && handlePriceModalClose()} />
        )}
      </section>
    </>
  );
};

export default Product;
