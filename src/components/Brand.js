import { Logo } from "../assets/style/index";

var BrandTitle = "Let's Shop"

/*
* brand small 60x60px
*/
const BrandSmall = () => {
  return (
    <div className="logo-brand row">
      <div class="col-sm-12">
        <img src={Logo} class="img" hight="200" width="170" alt="logo-shop" />
      </div>
      {/* <div class="col-sm-8">
        <h1>{BrandTitle}</h1>
      </div> */}
    </div>
  )
}

const BrandMedium = () => {
  return (
    <div className="logo-brand row">
      <div class="col-sm-12">
        <img src={Logo} class="img" hight="200" width="350" alt="logo-shop" />
      </div>
      {/* <div class="col-sm-8">
        <h1>{BrandTitle}</h1>
      </div> */}
    </div>
  )
}

export {BrandSmall,BrandMedium};