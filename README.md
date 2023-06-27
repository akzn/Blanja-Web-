# Blanja-Web

## Note
### env development : 
- setelah backend (BlanjaAPI) terinstall (`npm install`) dan database sudah selesai diunggah/import, run `knex migrate:latest` pda cli backend untuk melakukan migrasi database ke scheme terbaru. 
- pastikan credential midtrans client sudah diinputkan pada file .env. Jika belum punya akun midtrans, register ke midtrans dan copy server/client secret pada dashboard [SANDBOX](https://dashboard.sandbox.midtrans.com/) midtrans ke .env. Pastikan credential yang dicopy adalah credential sandbox
- Gunakan [Sanbox testing](https://docs.midtrans.com/en/technical-reference/sandbox-test) untuk testing payment midtrans. JANGAN GUNAKAN AKUN/BANK ASLI untuk testing. 

## About the project

Blanja-Web adalah sebuah web e-commerce dimana customer bisa membeli barang yang dicari dan seller bisa menjual barang. Blanja-Web ini dibuat untuk memudahkan seller dan customer dalam bertransaksi. Dibuat dengan framework javascript yaitu React Js untuk frontend, ExpressJs untuk backend, dan MYSQL untuk database.

## Build with Project
* [ReactJS](https://reactjs.org/)
* [MYSQL](https://www.mysql.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Node js](https://nodejs.org/en/)
* [React Bootstrap](https://react-bootstrap.github.io/)

## How to install
* Buka terminal atau command prompt
* Clone Repository https://github.com/AkbarZul/Blanja-Web-
* Buka folder dan tulis `yarn` atau `npm install` untuk install dependencies
* tulis `yarn start` atau `npm start`

## Screenshots
* Home
![screenshot-localhost_3000-2021 02 19-15_40_54](https://user-images.githubusercontent.com/67698809/108480211-3fd74e80-72c9-11eb-8dcf-b2d09255d897.png)
* Login
![Screenshot from 2021-02-15 22-26-48](https://user-images.githubusercontent.com/67698809/108480588-bb390000-72c9-11eb-8cb7-eb39dcaef306.png)
* Detail 
![screenshot-localhost_3000-2021 02 19-15_42_08](https://user-images.githubusercontent.com/67698809/108480828-03f0b900-72ca-11eb-9f3c-0f3d93c01f6e.png)
* MyBag
![Screenshot from 2021-02-15 22-25-48](https://user-images.githubusercontent.com/67698809/108480672-d572de00-72c9-11eb-86c8-4ea3b8d1f596.png)
* CheckOut
![Screenshot from 2021-02-15 22-25-54](https://user-images.githubusercontent.com/67698809/108480782-f5a29d00-72c9-11eb-8f79-d8338beddc36.png)

## Repository Backend
* [ClickHere](https://github.com/akzn/BlanjaAPI)

# notes : 
password : upper lower, has numeric
test user : u/p a@a.com/aaaaaaaA1