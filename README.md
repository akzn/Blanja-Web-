# E-commerce 

## About the project
 Aplikasi ini adalah platform e-commerce yang menyediakan kemudahan bagi customer dan toko untuk transaksi jual beli barang. Dibangun dengan menggunakan framework React.js untuk tampilan depan, Express.js untuk bagian backend, dan MySQL sebagai database.

## Fitur
1. katalog produk beserta kategorinya
2. sistem order produk
3. hitung ongkir dan tracking resi
4. pembayaran menggunakan payment gateway

## Main Dependencies
* [Node js](https://nodejs.org/en/)
* [ReactJS](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [react-router](https://reactrouter.com/)
* [Bootstrap](https://getbootstrap.com/)
* [React Bootstrap](https://react-bootstrap.github.io/)

> dependencies lain bisa dilihat di package.json

## Third party services
* [Midtrans](midtrans.com)
* [Biteship](biteship.com)

## How to install
* Pastikan backend [ClickHere](https://github.com/akzn/BlanjaAPI) sudah terinstall dan running
* Clone Repository https://github.com/akzn/Blanja-Web-
* Ketik `npm install` pada terminal di root directory pada repo untuk install dependencies
* ganti nama file `.env.local.example` hilangkan kata ".example"
* pada env di atas, set `REACT_APP_URL`, sesuaikan dengan ip dan port backend
* Ketik `npm start`

## Screenshots
TBA

## Repository Backend
* [ClickHere](https://github.com/akzn/BlanjaAPI)

# notes : 
password : upper lower, has numeric
test user : u/p a@a.com/aaaaaaaA1

# FAQ
1. Error undefined biteship_address_id saat klik buy pada checkout
   1. cek apakah admin sudah mengkonfigurasi address tokonya sebagai address utama. Pastikan apakah sudah memiliki biteship id pada database (jika belum memiliki biteship id, kemungkinan data lama sebelum implementasi fitur shipping)
2. ongkir pada halaman checkout tidak keluar
   1. cek apakah secret key biteship di backend sudah benar
   2. cek apakah produk sudah diset beratnya pada halaman admin
3. dimana ganti logo
   1. replace `src>assets>img>logo2.jpg`
4. error saat create/save edit product
   1. pastikan color/category/size sudah diselect
