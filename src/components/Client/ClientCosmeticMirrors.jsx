import React, { useState, useEffect } from "react";
import ModalGlassPartitions from ".././ModalGlassPartitions";
// import ListTheChoseFurniture from "../.ListTheChoseFurniture";
import { CSVLink } from "react-csv";
import { useSelector, useDispatch } from "react-redux";
import "../../style/shower.scss";
import DeliveryTemplate from "../DeliveryTemplate";
import ClientFooter from "../Template/ClientFooter";
import SelectObjecTemplateAndPhoto from "../Template/SelectObjecTemplateAndPhoto";
import InputTemplate from "../Template/InputTemplate";
import ButtonGobackAndTitle from "../ButtonGobackAndTitle";

const ClientCosmeticMirrors = ({ data }) => {
  const [currentObject, setCurrentObject] = useState({});
  const [currentType, setCurrentType] = useState(null);
  const [widthValue, setWidthValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [validationInput, setValidationInput] = useState(false);
  const [lightBulbsCount, setLightBulbsCount] = useState("");
  const [patronCount, setPatronCount] = useState("");
  const [currentProcessingСutout, setCurrentProcessingСutout] = useState(null);
  const [totalSum, setTotalSum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deliveryFirstName = useSelector(
    (state) => state.delivery.deliveryFirstName
  );
  const deliveryLastName = useSelector(
    (state) => state.delivery.deliveryLastName
  );
  const deliverySurName = useSelector(
    (state) => state.delivery.deliverySurName
  );
  const deliveryNumberPhone = useSelector(
    (state) => state.delivery.deliveryNumberPhone
  );
  const deliveryOrderComent = useSelector(
    (state) => state.delivery.deliveryOrderComent
  );
  const deliveryDistance = useSelector(
    (state) => state.delivery.deliveryDistance
  );
  const deliveryAdress = useSelector((state) => state.delivery.deliveryAdress);
  const deliveryBoolean = useSelector(
    (state) => state.delivery.deliveryBoolean
  );

  useEffect(() => {
    fetch("https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/get-all-cosmetic-mirrors")
      .then((res) => res.json())
      .then((data) => {
        setCurrentObject(data[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  const selectTypeFunc = (e) => {
    setCurrentType(e);
  };

  const selectProcessingСutoutFunc = (e) => {
    const selectedProcessing = JSON.parse(e.target.value);
    setCurrentProcessingСutout(selectedProcessing);
  };

  const calcTotalSumFunc = () => {
    if ((heightValue && heightValue >= 0) && (widthValue && widthValue >= 0)) {
      setValidationInput(false);
      const calcSize = Number(widthValue) * Number(heightValue);
      const calcSquareMeter = calcSize / 1000000;

      let deliveryPrice = 0;
      let deliveryPriceOverSity = 0;

      if (deliveryAdress != "") {
        deliveryPrice = 200;
      }

      if (deliveryBoolean) {
        deliveryPriceOverSity = Number(deliveryDistance) * 26;
      }

      const totalSum =
        (calcSquareMeter * currentType?.price || 0) +
        (currentObject?.lightBulbs * lightBulbsCount || 0) +
        (currentObject?.patron * patronCount || 0) +
        (currentProcessingСutout?.price || 0) +
        (deliveryBoolean ? deliveryPriceOverSity : deliveryPrice);

      const finishedShower = {
        // typeName: currentType?.name,
        // typePrice: currentType?.price,
        // glass: currentGlass,
        // glassColorName: currentGlassColor?.name,
        // glassColorPrice: currentGlassColor?.price,
        // width: widthValue,
        // height: heightValue,
        // volume: volumValue,
        // furniture: cart,
        // total: totalSum,
      };
      setTotalSum(totalSum);
    } else {
      setValidationInput(true);
    }
    
  };
  const handleFetch = async () => {

    // const resDepth = (depthValue ? ` X ${depthValue}` : '')

    const deliver = deliveryAdress ? deliveryAdress : 'Без доставки' ;

    const data = {
      order: {
        "source_id": 11,
        "buyer_comment": deliveryOrderComent,
        "buyer": {
          "full_name": `${deliveryFirstName} ${deliveryLastName} ${deliverySurName}`,
          "phone": deliveryNumberPhone
        },
        "shipping": {
          "delivery_service_id": 2,
          "shipping_address_city": deliver,
        },
        "products": [
          {
            "price": totalSum,
            "quantity": 1,
            "name": `Косметичне ${currentType.name} - ${widthValue} X ${heightValue} мм2` ,
            "comment": ` `,
            
          }
        ]
      }
    };

    setTimeout(() => {
      // setIsLoading(false);
      setIsSuccess(true);
    }, 1000);


    const response = await fetch('https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/create-crm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      
    });
    

  }

  return (
    <div>
      <ButtonGobackAndTitle title={'Косметичні дзеркала'}/>
        <SelectObjecTemplateAndPhoto
        title={"Виберіть тип"}
        optionName={""}
        changeFunc={selectTypeFunc}
        state={currentType}
        data={currentObject?.typeWordpress}
        wrapClass={"wrap_item type_shower"}
        selectWrapClass={"choose_item selected_shower"}
        selectDivWrap={true}
      />

<div className="img_standart_mirror_wrap">
        {currentType != null && 
        <img src={currentType.mirrorsImage}/>
      }
      </div>

      <div className="wrap_item size_shower">
        <h3>Вкажіть розміри (мм)</h3>
        <div className="size_input">
          <div className="size_item">
            <InputTemplate
              placeholder={"Ширина"}
              onChangeFunc={setWidthValue}
              value={widthValue}
              validationInput={validationInput}
              inputClass={"input_miroor_item cabel"}
            />
          </div>
          <div className="size_item">
            <InputTemplate
              placeholder={"Висота"}
              onChangeFunc={setHeightValue}
              value={heightValue}
              validationInput={validationInput}
              inputClass={"input_miroor_item cabel"}
            />
          </div>
        </div>
      </div>
      <DeliveryTemplate />
      <div className="footer_calc">
      <ClientFooter calcTotalSumFunc={calcTotalSumFunc} totalSum={totalSum} />
        <div className="send_order mirror_button">
        <button
            className={isSuccess ? "success" : ""}
            onClick={handleFetch}
            disabled={isLoading}
          >
            {isLoading ? "Зачекайте..." : isSuccess ? "Замовлення відправлено" : "Оформити"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCosmeticMirrors;
