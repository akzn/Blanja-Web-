import axios from "axios";
const API = process.env.REACT_APP_URL;
// Format integer into format number
export const formatNumber = (number, locale = 'en-US', minimumFractionDigits = null, maximumFractionDigits = null) => {
    const options = {};
    
    if (typeof number === 'undefined') {
        number = 0;
    }

    if (minimumFractionDigits !== null) {
      options.minimumFractionDigits = minimumFractionDigits;
    }
    
    if (maximumFractionDigits !== null) {
      options.maximumFractionDigits = maximumFractionDigits;
    }
    
    return number.toLocaleString(locale, options);
  };
  
  export const getMidtransStatus = async (orderCode, token) => {
    try {
      const response = await axios.get(`${API}/payment/midtrans/get-status/${orderCode}`, {
        headers: {
          "x-access-token": "Bearer " + token,
        },
      });
      const data = response.data.data;
      console.log('response', data);
      // updatePaymentData(data);
  
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  export const PaymentStatusLabel = (status) => {
    console.log('payment_Status',status)
    const getStatusLabel = () => {

      const lowercaseStatus = status && status.toLowerCase();

      if (lowercaseStatus === 'settlement' || lowercaseStatus === 'capture') {
        return <span style={{ color: 'green', fontWeight: 600 }}>PAID</span>;
      } else if (lowercaseStatus === 'pending') {
        return <span style={{ color: 'red', fontWeight: 600 }}>Waiting for payment</span>;
      } else if (lowercaseStatus === 'expire' || lowercaseStatus === 'canceled') {
        return <span style={{ color: 'grey', fontWeight: 600 }}>{lowercaseStatus.toUpperCase()}</span>;
      } else if (lowercaseStatus === null) {
        return <span style={{ color: 'red', fontWeight: 600 }}>WAITING FOR PAYMENT</span>;
      } else {
        return <span style={{ color: 'red', fontWeight: 600 }}>UNKNOWN</span>;
      }
    };
  
    return (
        <span>{getStatusLabel()}</span>
    );
  };
  