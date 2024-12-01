import { useEffect, useState } from "react";
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import Select from 'react-select';

const PriceModal = ({ onClose, onAddPrice }) => {
  const [value, setValue] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  
  const handleCurrencyChange = (selectedOptions) => {
    setSelectedCurrency(selectedOptions);
  };

    useEffect(() => {

        const getCurrencies = async () => {
            try {
            const response = await axiosPrivate.get('currency');
            const currenciesData = response.data;
            setCurrencies(currenciesData.map((currency) => ({ value: currency.id, label: currency.description })));
            } catch (err) {
            console.error(err);
            }
        };
        
    getCurrencies()
  }, []);
  const handleAddPriceModal = async (newPrice) => {
    console.log(newPrice)
    onAddPrice(newPrice);
    onClose();
  };

  return (
    <Modal className="modal-sl" show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Price</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="price-value" className="form-label">Value</label>
            <input type="number" step="0.01" className="form-control" id="price-value" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="price-currency" className="form-label">Currency</label>
            <Select
                options={currencies}
                value={selectedCurrency}
                onChange={handleCurrencyChange}
              />

            {/* <Select
              className="form-control"
              options={currencies}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.value)} */}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary"  onClick={() => handleAddPriceModal({ value, selectedCurrency })}>
          Add Price
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PriceModal;