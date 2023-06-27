/**
 * page untuk handle Midtrans response/Redirection
 */

import React, { useState, useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { API } from "../utility/Auth";
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import { getMidtransStatus } from "../helpers/Utils";

const MidtransFinishRedirect = (props) =>{
    var order_id = props.location.state?.id || null;
    const [id, setId] = useState([]);
    const [order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionCode, setTransactionCode] = useState('');
    const [statusCode, setStatusCode] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');

    const token = useSelector((state) => state.auth.data.token);

    const getOrderItemByCode = async () => {
        axios
        .get(`${API}/orders/transaction-code/${transactionCode}`, {
            headers: {
                "x-access-token": "Bearer " + token,
            },
        })
        .then(async ({ data }) => {
            const orderData = data.data;
            setOrder(orderData);
        })
        .catch((err) => {
            console.log("error", err);
        });
    };

    const HandleGetMidtransStatus = async () => {
        await getMidtransStatus(transactionCode,token)
        console.log('order_id2',order.id)
        if(order.id){
            props.history.push(`/order-detail/${transactionCode}`);
        } else {
            props.history.push('/myorder/');
        }
    };

    // const updatePaymentData = async (data) => {

    //     console.log('data',data)
    //     if (data.status_code) {
    //         let channel_info = {};
    //         let trx_info = {};
    //         if (data.va_numbers) {
    //             channel_info = {
    //                 channel_name:data.va_numbers.bank,
    //                 va_number:data.va_numbers.va_number 
    //             }
    //         }
    //         trx_info = {
    //             transaction_id:data.transaction_id,
    //             transaction_status:data.transaction_status,
    //             status_code:data.status_code,
    //         }
    //         const mergedJson = Object.assign({}, trx_info, channel_info);
    //         let formData = {
    //             'transaction_code' : transactionCode,
    //             'data' : {
    //                 ...mergedJson
    //             }
    //         }
    //         // setIsLoading(true)
    //         await axios
    //         .patch(`${API}/payment/midtrans/by-code`, formData, {
    //             headers: {
    //                 "x-access-token": "Bearer " + token,
    //             },
    //         })
    //         .then( ({ data }) => {
    //             console.log('patch data:',data)
    //             // setMidtransData(data.data)
    //         })
    //         .catch((err,es) => {
    //             let message
    //             console.log("error", err);
    //             if (err.response) {
    //                 console.log(err.response.data.message)
    //                 message = err.response.data.message
    //             } else {
    //                 console.log('API error')
    //                 message = "Network error while trying to connet to API"
    //             }
    //             // let emessage = json.stringify(err)
    //         })
    //         .finally(() => {
    //             // setIsLoading(false)
    //             // window.location.reload(false);
    //             props.history.push('/myorder/');
    //             // return <Redirect to={`/order-detail/${transactionCode}`} />;
    //         });
    //         // setIsLoading(false)
    //     } else {
            
    //     }
    //   };

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const order_id = urlSearchParams.get('order_id');
        const status_code = urlSearchParams.get('status_code');
        const transaction_status = urlSearchParams.get('transaction_status');

        setTransactionCode(order_id)
        setStatusCode(status_code)
        setTransactionStatus(transaction_status)
      }, []);

    useEffect( async () => {
        console.log('transactionCode',transactionCode)
        if (transactionCode !=null && transactionCode != undefined) {
            getOrderItemByCode()
        }
    },[transactionCode])

    useEffect(() => {
        console.log('orderState',order)
        order_id = order?.id || null;
        if (order_id !=null && order_id != undefined) {
            setId(order_id)
            HandleGetMidtransStatus()
        }
      }, [order]);
    
    useEffect(() => {
        if (setId !=null && setId != undefined) {
            HandleGetMidtransStatus()
        }
    }, [setId]);

    // useEffect( async () => {
    //     // await getOrderItemByCode();
    //     // order_id = order.id;
    // },[transactionCode])

    return(
        <LoadingOverlay
            active={isLoading}
            spinner
            text={'processing...'}
        >
            
            <Navbar />
                
            
        </LoadingOverlay>
    )
}


export { MidtransFinishRedirect }