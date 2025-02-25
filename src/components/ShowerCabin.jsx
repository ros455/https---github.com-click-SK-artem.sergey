import React, { useState, useEffect } from "react";
import Modal from "./Furniture/Modal";
import ModalAllFurniture from "./ModalAllFurniture";
import ListTheChosenFurniture from "./Furniture/ListTheChoseFurniture";
import PdfFile from "./PdfFile/PdfShowerManadger";
import PdfFileClient from "./PdfFile/PdfShowerClient";
import { useSelector, useDispatch } from 'react-redux';
import { addCart, removeAll} from '../store/cart';
import '../style/shower.scss'
import { PDFDownloadLink } from '@react-pdf/renderer';
import DeliveryTemplate from "./DeliveryTemplate";
import { json } from "react-router-dom";
import SelectObjecTemplate from "./Template/SelectObjecTemplate";
import SelectObjecTemplateAndPhoto from "./Template/SelectObjecTemplateAndPhoto";
import InputTemplate from "./Template/InputTemplate";
import InputTemplateWithoutValidation from "./Template/InputTemplateWithoutValidation";
import ClientFooter from './Template/ClientFooter';
import SendPdfBlockTemplate from './Template/SendPdfBlockTemplate';
import ProcessingCoutPlusCountTemplate from './Template/ProcessingCoutPlusCountTemplate';
import GlassProcessingTemplate from "./Template/GlassProcessingTemplate";
import GlassProcessingCountTemplate from './Template/GlassProcessingCountTemplate';

const ShowerCabin = () => {
  const [allData, setAllData] = useState([]);
  const [currentObject, setCurrentObject] = useState({});
  const [totalSum, setTotalSum] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentGlass, setCurrentGlass] = useState("");
  const [currentGlassColor, setCurrentGlassColor] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAllFurnitureIsOpen, setModalAllFurnitureIsOpen] = useState(false);
  const [widthValue, setWidthValue] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [depthValue, setDepthValue] = useState('');
  const [depthSecondValue, setDepthSecondValue] = useState('');
  const [volumValue, setVolumValue] = useState(0);
  const [widthSum, setWidthSum] = useState(0);
  const [heightSum, setHeightSum] = useState(0);
  const [volumSum, setVolumSum] = useState(0);
  const [validationInput, setValidationInput] = useState(false);
  const [isAssemblingt, setIsAssembling] = useState(false);
  const [minInstallation, setMinInstallation] = useState('');
  const [finishedShowerPdf, setFinishedShowerPdf] = useState({});
  const [currentProcessingStandart, setCurrentProcessingStandart] = useState(null);
  const [currentProcessingСutout, setCurrentProcessingСutout] = useState(null);
  const [currentProcessingСutoutCount, setCurrentProcessingСutoutCount] = useState('');
  const [furniture, setFurniture] = useState('none');
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [additionalAssemblingName, setAdditionalAssemblingName] = useState('');
  const [additionalAssemblingPrice, setAdditionalAssemblingPrice] = useState('');
  const [glassProcessingArr, setGlassProcessingArr] = useState([]);
  const [glassProcessingCountArr, setGlassProcessingCountArr] = useState([]);

  const cart = useSelector((state) => state.cart.items);
  const copyCart = useSelector((state) => state.cart.copyItems);

  const dispatch = useDispatch();

  console.log('currentType',currentType);


  const deliveryFirstName = useSelector((state) => state.delivery.deliveryFirstName);
  const deliveryLastName = useSelector((state) => state.delivery.deliveryLastName);
  const deliverySurName = useSelector((state) => state.delivery.deliverySurName);
  const deliveryNumberPhone = useSelector((state) => state.delivery.deliveryNumberPhone);
  const deliveryOrderComent = useSelector((state) => state.delivery.deliveryOrderComent);
  const deliveryDistance = useSelector((state) => state.delivery.deliveryDistance);
  const deliveryAdress = useSelector((state) => state.delivery.deliveryAdress);
  const deliveryBoolean = useSelector((state) => state.delivery.deliveryBoolean);

  useEffect(() => {
    if(currentType) {
      dispatch(removeAll())
      currentType?.defaultFurniture.forEach((item) => {
        dispatch(addCart(item))
      })
    }
  },[currentType])
 

  useEffect(() => {
    fetch("https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/get-all-shower")
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
        setCurrentObject(data[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  const selectTypeFunc = (e) => {
    // const selectedType = JSON.parse(e.target.value);
    setCurrentType(e);
  };
  const selectGlassFunc = (e) => {
    setCurrentGlass(e.target.value);
  };
  const selectGlassColorFunc = (e) => {
    const selectedGlassColor = JSON.parse(e.target.value);
    setCurrentGlassColor(selectedGlassColor);
  };
  const minInstallationFunc = (e) => {
    const selectedGlassColor = JSON.parse(e.target.value);
    setMinInstallation(minInstallation);
  };

  const calcTotalSumFunc = () => {
    if((heightValue && heightValue >= 0) && (widthValue && heightValue >= 0)) {
      setValidationInput(false);
      const calcSize = (depthValue ? 
        (((Number(widthValue) * Number(heightValue)) + (Number(heightValue) * Number(depthValue)) + (depthSecondValue ? (Number(heightValue) * Number(depthSecondValue)) : 0)) * 2) 
        : (Number(widthValue) * Number(heightValue) * 2));

      const calcSquareMeter = calcSize/1000000;
      const resSizePrice = calcSquareMeter * (currentGlassColor?.price || 0);
      const resCurrentProcessingStandart = Number(currentProcessingStandart?.price)  * calcSquareMeter;
  
      let totalSumFurniture = 0;

      let intslPrice = 0;
      let deliveryPrice = 0;
      let deliveryPriceOverSity = 0;
      let deliveryFinalyPrice = 0;

     

      if (calcSquareMeter < 2){
        intslPrice = calcSquareMeter * 300
     } else if (calcSquareMeter > 2){
       intslPrice = calcSquareMeter * 350
     };
     
     if (deliveryAdress != ''){
       deliveryPrice = 200
     }

     if (deliveryBoolean){
       deliveryPriceOverSity = Number(deliveryDistance) * 26
     }
  
      cart.forEach((el) => {
        el.colorsFurniture.forEach((item) => {
          totalSumFurniture += item.price * el.count
        })
      })

      let totalSumProcessing = 0

      glassProcessingCountArr.forEach((el) =>{
          totalSumProcessing += el.price * el.count 
      })


      let totalSumglassProcessing = 0

      glassProcessingArr.forEach((el) =>{
        totalSumglassProcessing += el.price * calcSquareMeter
      })

  
      const totalSum = resSizePrice +  
      totalSumFurniture + totalSumProcessing + totalSumglassProcessing +
      (isAssemblingt ? currentType?.price : 0) + 
      (deliveryBoolean ? deliveryPriceOverSity : deliveryPrice) +
      (calcSquareMeter * currentProcessingStandart?.price || 0) + 
      (currentProcessingСutout?.price * currentProcessingСutoutCount || 0) + 
      (additionalAssemblingPrice ? Number(additionalAssemblingPrice) : 0);

      
      const finishedShower = {
        type: currentType?.name, /* назва душ кабіни */
        goodsPrice: isAssemblingt ? currentType?.price : '',  /* ціна душ кабіни */
        width: widthValue, /* ширина душ кабіни */
        height: heightValue, /* висота - ціна душ кабіни */ 
        depth: depthValue, /* глубина */

        depthSecond: depthSecondValue, /* глубина */
        glass: currentGlass ? currentGlass : '' ,  /* скло - товщина душ кабіни */
        glassColorName:  currentGlass ? currentGlassColor?.name : '', /* скло - колір душ кабіни */
        glassColorPrice: currentGlass ? currentGlassColor?.price : '', /* скло - ціна душ кабіни */
        volume: volumValue, 
        cart: copyCart, /* масив фурнітур душ кабіни */
        adress:deliveryAdress, /* адреса доставки */
        deliveryPriceOverSity: deliveryBoolean ? deliveryPriceOverSity : '', /* ціна доставки за містом */
        deliveryPriceOver: !deliveryBoolean ? deliveryPrice : '',  /* ціна доставки по місту */
        firstName: deliveryFirstName,
        lastName: deliveryLastName,
        surname: deliverySurName,
        numberPhone: deliveryNumberPhone,
        orderComent: deliveryOrderComent,
        minInstallation: minInstallation ? minInstallation : '',
        minInstallationName: minInstallation ? 'Монтаж' : '',
        minInstallationOption: minInstallation ? "Мінімальний" : '',
        isAssemblingt: isAssemblingt ? minInstallation : '',
        isAssemblingtName: isAssemblingt ? 'Монтаж' : '',
        isAssemblingOption: isAssemblingt ? 'По розміру' : '',
        currentProcessingStandartName: currentProcessingStandart ? 'Обробка' : '',
        currentProcessingStandartVal: currentProcessingStandart ? currentProcessingStandart?.name : '',
        currentProcessingStandartPrice: currentProcessingStandart ? resCurrentProcessingStandart : '',
        currentProcessingСutoutName: currentProcessingСutout ? currentProcessingСutout?.name : '',
        currentProcessingСutoutPrice: currentProcessingСutout ? currentProcessingСutout?.price : '',
        currentProcessingСutoutCount: currentProcessingСutoutCount ? `${currentProcessingСutoutCount} шт` : '',
        additionalAssemblingValue: additionalAssemblingName ? additionalAssemblingName : '',
        additionalAssemblingName: additionalAssemblingName ? 'Додатковий монтаж' : '',
        additionalAssemblingPrice: additionalAssemblingPrice ? `${additionalAssemblingPrice}` : '',
        total: totalSum, /* скло - ціна душ кабіни */
      }

      console.log('finishedShower',finishedShower);

      setFinishedShowerPdf(finishedShower)

      setTotalSum(totalSum)
    } else {
      setValidationInput(true);
    }
  }

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleOpenAllFurnitureModal = () => {
    setModalAllFurnitureIsOpen(true);
  };

  const handleCloseModalAllFurniture = () => {
    setModalAllFurnitureIsOpen(false);
  };


  const handleCloseModal = () => {
    setModalIsOpen(false);
  };


  const changeIsAssemblingt = () => {
    // const paintingObj = data?.option?.painting;
    setIsAssembling(isAssemblingt => !isAssemblingt)
  }

    const changeMinInstallationFunc = () => {
    // const paintingObj = data?.option?.painting;
    setMinInstallation(minInstallation => !minInstallation)
  }

  const addPriceInstalation = (e) => {
    // const cordObj = data?.option?.cord;
    setMinInstallation(e.target.value);
  }

  const selectProcessingStandartFunc = (e) => {
    const selectedProcessing = JSON.parse(e.target.value);
    setCurrentProcessingStandart(selectedProcessing);
  };

  const selectProcessingСutoutFunc = (e) => {
    const selectedProcessing = JSON.parse(e.target.value);
    setCurrentProcessingСutout(selectedProcessing);
  };

  const handleFetch = async () => {

    const furnitureFinObj = {};
    const furnitureFinArr = [];

    cart.forEach((item, index) => {
      const itemData = {
        colorsFurniture: item.colorsFurniture[0].color,
        colorsFurniturePrice: item.colorsFurniture[0].price,
        tittleName: item.title,
        name2: item.depends[0],
        name3: item.depends[1],
        drawingImgSrc: item.drawingImg,
        mainImageSrc: item.mainImage,
        count: item.count,
      };
      furnitureFinArr.push(itemData);
      
    });

  furnitureFinArr.forEach((item, index) => {
    furnitureFinObj[index] = `${item.name2} ${item.tittleName} ${item.colorsFurniture} - ${item.count} шт`   
  });

  const resDepth = (finishedShowerPdf.depth ? ` X ${finishedShowerPdf.depth}` : '')

  // let result = JSON.stringify(furnitureFinObj);
  let result = JSON.stringify(furnitureFinObj).replace(/\\|"|\[|\]/g, '').replace(/},{/g, ', ');
  result = result.replace(/{"\d+":|}/g, '');

    const deliver = finishedShowerPdf.adress ? finishedShowerPdf.adress : 'Без доставки' ;

    const data = {
      order: {
        "source_id": 10,
        "buyer_comment": finishedShowerPdf.orderComent,
        "buyer": {
          "full_name": `${finishedShowerPdf.lastName} ${finishedShowerPdf.firstName} ${finishedShowerPdf.surname}`,
          "phone": finishedShowerPdf.numberPhone
        },
        "shipping": {
          "delivery_service_id": 2,
          "shipping_address_city": deliver,
        },
        "products": [
          {
            "price": finishedShowerPdf.total,
            "quantity": 1,
            "name": `${finishedShowerPdf.type} - ${finishedShowerPdf.width} X ${finishedShowerPdf.height} ${resDepth} мм2` ,
            "comment": ` `,
            "properties": [
              {
                "name": finishedShowerPdf.currentProcessingStandartName,
                "value": finishedShowerPdf.currentProcessingStandartVal
              },
              {
                "name": finishedShowerPdf.currentProcessingСutoutName,
                "value": finishedShowerPdf.currentProcessingСutoutCount
              },
              {
                "name": finishedShowerPdf.additionalAssemblingName,
                "value": `${finishedShowerPdf.additionalAssemblingValue}`
              },
              ...Object.values(furnitureFinObj).filter(value => value.name !== '').map(value => ({
                "name": 'Фурнітура',
                "value": value
              })),
                glassProcessingArr.forEach((el) => (
                  {"name": `${el.name}`,
                  "value": `${el.price}`}
                )),
                glassProcessingCountArr.forEach((el) => (
                  {"name": `${el.name}`,
                  "value": `${el.count}`}
                ))
              
            ]
          }
        ]
      }
    };


    // console.log('HI', furnitureFinObj , );
    console.log('HsI', Object.entries(furnitureFinObj)  );
    // setIsLoading(true);
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
    <div className="shower_wrapper">
      <h1>Душові кабіни</h1>

      <SelectObjecTemplateAndPhoto
        title={"Варіанти душових"}
        optionName={""}
        changeFunc={selectTypeFunc}
        state={currentType}
        data={currentObject?.type}
        wrapClass={"wrap_item type_shower"}
        selectWrapClass={"choose_item selected_shower"}
        selectDivWrap={true}
      />
      <div className="img_shower_wrap">
        {currentType && 
        <img src={currentType.showerImage}/>
      }
      </div>

      <SelectObjecTemplate
        title={"Тип скла"}
        optionName={""}
        changeFunc={selectGlassColorFunc}
        state={currentGlassColor}
        data={currentObject?.glassThickness}
        wrapClass={"wrap_item color_glass"}
        selectWrapClass={"choose_item selected_shower"}
        selectDivWrap={true}
      />
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
          <div className="size_item">
            <InputTemplateWithoutValidation
              placeholder={"Глибина"}
              onChangeFunc={setDepthValue}
              value={depthValue}
              inputClass={"input_miroor_item cabel"}
            />
          </div>
          <div className="size_item">
            <InputTemplateWithoutValidation
              placeholder={"Глибина"}
              onChangeFunc={setDepthSecondValue}
              value={depthSecondValue}
              inputClass={"input_miroor_item cabel"}
            />
          </div>
        </div>
      </div>

      {currentObject?.processingStandart && (
        <GlassProcessingTemplate
          processingStandart={currentObject?.processingStandart}
          currentArr={glassProcessingArr}
          setCurrentArr={setGlassProcessingArr}
        />
      )}

      {currentObject?.processingСutout && (
        <GlassProcessingCountTemplate
          processingStandart={currentObject?.processingСutout}
          currentArr={glassProcessingCountArr}
          setCurrentArr={setGlassProcessingCountArr}
          title={'Додаткова обробка:'}
        />
      )}

      <div className="firnitur">
        <button className="button_open" onClick={handleOpenModal}>
          Обрати фурнітуру
        </button>
        <Modal
          isOpen={modalIsOpen}
          onClose={handleCloseModal}
          furnitureProps={currentObject?.furniture}
        />
      </div>
      <div className="firnitur">
        <button className="button_open" onClick={handleOpenAllFurnitureModal}>
          Вся фурнітура
        </button>
        <ModalAllFurniture
          isOpen={modalAllFurnitureIsOpen}
          onClose={handleCloseModalAllFurniture}
        />
      </div>
      <ListTheChosenFurniture />

      <div>
        <div className="choose_item item_mirrors item_montaje">
          <h3>Монтаж:</h3>
          <div className="montaje_wrap">
            <div className="checkbox_wrap montaje">
              <input
                id="checkbox3"
                className="checkbox"
                type="checkbox"
                checked={isAssemblingt}
                onChange={changeIsAssemblingt}
              />
              <label className="checkbox-label" htmlFor="checkbox3"></label>
            </div>
          </div>
        </div>
      </div>

      <div className="choose_item item_mirrors item_montaje  ">
        <p style={{ fontSize: "19px" }}>Додатковий монтаж</p>
        <input
          className="input_miroor_item"
          style={{ width: "50%" }}
          value={additionalAssemblingName}
          onChange={(e) => setAdditionalAssemblingName(e.target.value)}
          placeholder=""
        />
        <input
          type="number"
          style={{ width: "50%" }}
          className="input_miroor_item"
          value={additionalAssemblingPrice}
          onChange={(e) => setAdditionalAssemblingPrice(e.target.value)}
          placeholder="ціна"
        />
      </div>

      <DeliveryTemplate />

      <div className="footer_calc">
        <ClientFooter calcTotalSumFunc={calcTotalSumFunc} totalSum={totalSum} />
        <div className="send_order">
          {!isPrintPDF && (
            <div
              className="mirror_button_exel"
              style={{ fontSize: 14 }}
              onClick={() => setIsPrintPDF((state) => !state)}
            >
              Роздрукувати PDF
            </div>
          )}
          {isPrintPDF && (
            <div className="mirror_button_exel" style={{ fontSize: 14 }}>
              Роздрукувати PDF
              <div className="print_wrap">
                <div
                  className="close_pdf"
                  onClick={() => setIsPrintPDF((state) => !state)}
                >
                  {" "}
                  x{" "}
                </div>
                <PDFDownloadLink
                  className="print print_manager"
                  style={{ fontSize: 14 }}
                  document={<PdfFile 
                  order={finishedShowerPdf} 
                  cart={cart} 
                  img={currentType.showerImage}
                  glassProcessingCountArr = {glassProcessingCountArr}
                  glassProcessingArr = {glassProcessingArr}
                  />}
                  fileName={`Душові кабіни менеджер ${new Date()
                    .toLocaleString()
                    .replaceAll("/", "-")
                    .replaceAll(":", "-")}.pdf`}
                >
                  {({ loading, error }) =>
                    loading ? "завантаження..." : "Для менеджера"
                  }
                </PDFDownloadLink>
                <PDFDownloadLink
                  className="print print_client"
                  style={{ fontSize: 14 }}
                  document={<PdfFileClient 
                    order={finishedShowerPdf}
                    img={currentType.showerImage}
                     />}
                  fileName={`Душові кабіни клієнт ${new Date()
                    .toLocaleString()
                    .replaceAll("/", "-")
                    .replaceAll(":", "-")}.pdf`}
                >
                  {({ loading, error }) =>
                    loading ? "завантаження..." : "Для клієнта"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          )}
          <button
            className={isSuccess ? "success" : ""}
            onClick={handleFetch}
            disabled={isLoading}
          >
            {isLoading
              ? "Зачекайте..."
              : isSuccess
              ? "Замовлення відправлено"
              : "Оформити"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowerCabin;
