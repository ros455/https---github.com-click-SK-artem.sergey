
import React, { useState, useEffect } from "react";
import Modal from "./Furniture/Modal";
import ModalAllFurniture from "./ModalAllFurniture";
import ListTheChoseFurniture from "./Furniture/ListTheChoseFurniture";
import PdfFile from "./PdfFile/PdfFileDashkiManager";
import PdfFileClient from "./PdfFile/PdfFileDashkiClient";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CSVLink } from "react-csv";
import { useSelector, useDispatch } from 'react-redux';
import DeliveryTemplate from "./DeliveryTemplate";
import SelectObjecTemplate from "./Template/SelectObjecTemplate";
import InputTemplate from "./Template/InputTemplate";
import ClientFooter from './Template/ClientFooter';
import SendPdfBlockTemplate from './Template/SendPdfBlockTemplate';
import ProcessingCoutPlusCountTemplate from './Template/ProcessingCoutPlusCountTemplate';
import GlassProcessingTemplate from "./Template/GlassProcessingTemplate";
import GlassProcessingCountTemplate from './Template/GlassProcessingCountTemplate';
import '../style/shower.scss'

const Dashki = () => {
  const [currentObject, setCurrentObject] = useState({});
  const [currentType, setCurrentType] = useState(null);
  const [validationInput, setValidationInput] = useState(false);
  const [widthValue, setWidthValue] = useState('');
  const [volumValue, setVolumValue] = useState('');
  const [currentColor, setCurrentColor] = useState(null);
  const [isVanta, setIsVanta] = useState(false);
  const [vantaValue, setVantaValue] = useState(false);
  const [isDepository, setIsDepository] = useState(false);
  const [depositoryValue, setDepositoryValue] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAllFurnitureIsOpen, setModalAllFurnitureIsOpen] = useState(false);
  const [totalSum, setTotalSum] = useState(null);
  const [currentProcessingStandart, setCurrentProcessingStandart] = useState(null);
  const [currentProcessingСutout, setCurrentProcessingСutout] = useState(null);
  const cart = useSelector((state) => state.cart.items);
  const [isAssemblingt, setIsAssembling] = useState(false);
  const [minInstallation, setMinInstallation] = useState('');
  const [finishedShowerPdf, setFinishedShowerPdf] = useState({});
  const [currentProcessingСutoutCount, setCurrentProcessingСutoutCount] = useState('');
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [glassProcessingArr, setGlassProcessingArr] = useState([]);
  const [glassProcessingCountArr, setGlassProcessingCountArr] = useState([]);

  const deliveryFirstName = useSelector((state) => state.delivery.deliveryFirstName);
  const deliveryLastName = useSelector((state) => state.delivery.deliveryLastName);
  const deliverySurName = useSelector((state) => state.delivery.deliverySurName);
  const deliveryNumberPhone = useSelector((state) => state.delivery.deliveryNumberPhone);
  const deliveryOrderComent = useSelector((state) => state.delivery.deliveryOrderComent);
  const deliveryDistance = useSelector((state) => state.delivery.deliveryDistance);
  const deliveryAdress = useSelector((state) => state.delivery.deliveryAdress);
  const deliveryBoolean = useSelector((state) => state.delivery.deliveryBoolean);

  useEffect(() => {
    fetch("https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/get-all-dashki")
      .then((res) => res.json())
      .then((data) => {
        setCurrentObject(data[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  const selectTypeFunc = (e) => {
    const selectedType = JSON.parse(e.target.value);
    setCurrentType(selectedType);
  };

  const selectColorFunc = (e) => {
    const selectedColor = JSON.parse(e.target.value);
    setCurrentColor(selectedColor);
  };

  const changeVanta = () => {
    setIsVanta(isVanta => !isVanta)
  }

  const changeDepository = () => {
    setIsDepository(isDepository => !isDepository)
  }

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleOpenAllFurnitureModal = () => {
    setModalAllFurnitureIsOpen(true);
  };

  const handleCloseModalAllFurniture = () => {
    setModalAllFurnitureIsOpen(false);
  };

  const calcTotalSumFunc = () => {
    if(widthValue && widthValue >= 0) {
      setValidationInput(false);
      const calcSize = Number(widthValue) * Number(volumValue);
      const calcSquareMeter = calcSize/1000000;
      const resCurrentProcessingStandart = Number(currentProcessingStandart?.price)  * calcSquareMeter
  
      let totalSumFurniture = 0;
      let deliveryPrice = 0;
      let deliveryPriceOverSity = 0;

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

      const totalSum = totalSumFurniture + totalSumProcessing + totalSumglassProcessing +
      (calcSquareMeter * currentType?.price || 0) +
      (calcSquareMeter * currentColor?.price || 0) +
      (isVanta ? currentObject?.vanta * vantaValue : 0) +
      (isDepository ? currentObject?.depository?.price * depositoryValue : 0) +
      (calcSquareMeter * currentProcessingStandart?.price || 0) +
      (currentProcessingСutout?.price * currentProcessingСutoutCount || 0) + 
      (deliveryBoolean ? deliveryPriceOverSity : deliveryPrice);;
  
      const finishedShower = {
        type:  currentType ?  currentType.name : '', /* назва */
        goodsPrice: currentType ?  currentType.price : '',
        width: widthValue, /* ширина */
        // height: heightValue, /* висота */
        depth: volumValue ? volumValue : '', /* глубина */
        // glassThicknessName:  currentType ? currentType?.name : '', /* скло - товщина */
        // glassThicknessPrice: currentType ? currentType?.price : '', /* скло - ціна */
        glassColorName: currentColor ? currentColor?.name : '', /* скло колір - ціна */
        glassColorPrice: currentColor ? currentColor?.price : '', /* скло колір - ціна */
        adress:deliveryAdress, /* адреса доставки */
        deliveryPriceOverSity: deliveryBoolean ? deliveryPriceOverSity : '', /* ціна доставки за містом */
        deliveryPriceOver: !deliveryBoolean ? deliveryPrice : '',  /* ціна доставки по місту */
        firstName: deliveryFirstName,
        lastName: deliveryLastName,
        surname: deliverySurName,
        numberPhone: deliveryNumberPhone,
        orderComent: deliveryOrderComent,
        currentProcessingStandartName: currentProcessingStandart ? 'Обробка' : '',
        currentProcessingStandartVal: currentProcessingStandart ? currentProcessingStandart?.name : '',
        currentProcessingStandartPrice: currentProcessingStandart ? resCurrentProcessingStandart : '',
        currentProcessingСutoutName: currentProcessingСutout ? currentProcessingСutout?.name : '',
        currentProcessingСutoutPrice: currentProcessingСutout ? currentProcessingСutout?.price : '',
        currentProcessingСutoutCount: currentProcessingСutoutCount ? `${currentProcessingСutoutCount} шт` : '',
        vantaName: isVanta ? "Ванта" : '',
        vantaPrice: isVanta ? currentObject?.vanta : '',
        vantaValue: isVanta ? vantaValue : '',
        depositoryName : isDepository ? 'Закладна' : '',
        depositoryPrice : isDepository ? currentObject?.depository?.price : '',
        depositoryValue : isDepository ? depositoryValue : '',
        total: totalSum, /* скло - ціна душ кабіни */
      }

      setFinishedShowerPdf(finishedShower)
      setTotalSum(totalSum)
    } else {
      setValidationInput(true);
    }
  }

  const selectProcessingStandartFunc = (e) => {
    const selectedProcessing = JSON.parse(e.target.value);
    setCurrentProcessingStandart(selectedProcessing);
  };

  const selectProcessingСutoutFunc = (e) => {
    const selectedProcessing = JSON.parse(e.target.value);
    setCurrentProcessingСutout(selectedProcessing);
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
            "name": ` Скляна перегородка ${finishedShowerPdf.type} - ${finishedShowerPdf.width} X ${finishedShowerPdf.depth} мм2` ,
            "comment": ` `,
            "properties": [
              {
                "name": `Колір скла`,
                "value": finishedShowerPdf.glassColorName
              },
              {
                "name": `Ванта`,
                "value": finishedShowerPdf.vantaValue
              },
              {
                "name": `Закладна`,
                "value": finishedShowerPdf.depositoryValue
              },
              {
                "name": finishedShowerPdf.currentProcessingStandartName,
                "value": finishedShowerPdf.currentProcessingStandartVal
              },
              {
                "name": finishedShowerPdf.currentProcessingСutoutName,
                "value": finishedShowerPdf.currentProcessingСutoutCount
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

    setIsLoading(true);

    const response = await fetch('https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/create-crm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  }


  return (
    <div className="shower_wrapper">
      <h1>Дашки</h1>

      <SelectObjecTemplate
        title={"Тип скла"}
        optionName={""}
        changeFunc={selectTypeFunc}
        state={currentType}
        data={currentObject?.typeGlass}
        wrapClass={"wrap_item type_shower"}
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
              placeholder={"Глибина"}
              onChangeFunc={setVolumValue}
              value={volumValue}
              validationInput={validationInput}
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
          title={"Додаткова обробка:"}
        />
      )}

      <div className="choose_item item_mirrors check-item">
        <h3>Ванта:</h3>
        <div className="checkbox_wrap">
          <input
            id="checkbox1"
            className="checkbox"
            type="checkbox"
            checked={isVanta}
            onChange={changeVanta}
          />
          <label className="checkbox-label" htmlFor="checkbox1"></label>
        </div>
      </div>
      {isVanta && (
        <div className="wrap_item size_shower">
          <h3>Вкажіть розміри</h3>
          <div className="size_input">
            <div className="size_item">
              <input
                type="number"
                placeholder="М/погонний"
                value={vantaValue < 0 ? 1 : vantaValue}
                onChange={(e) => setVantaValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="choose_item item_mirrors check-item">
        <h3>Закладна:</h3>
        <div className="checkbox_wrap">
          <input
            id="checkbox2"
            className="checkbox"
            type="checkbox"
            checked={isDepository}
            onChange={changeDepository}
          />
          <label className="checkbox-label" htmlFor="checkbox2"></label>
        </div>
      </div>
      {isDepository && (
        <div className="wrap_item size_shower">
          <h3>Вкажіть кількість шт</h3>
          <div className="size_input">
            <div className="size_item">
              <input
                type="number"
                placeholder="Кількість"
                value={depositoryValue < 0 ? 1 : depositoryValue}
                onChange={(e) => setDepositoryValue(e.target.value)}
              />
            </div>
          </div>
        </div>
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
      <ListTheChoseFurniture />
      <DeliveryTemplate />
      {/* <div className="footer_calc">
      <ClientFooter calcTotalSumFunc={calcTotalSumFunc} totalSum={totalSum} />
        <div className="send_order">
          <div className="mirror_button_exel" style={{ fontSize: 14 }}>
            <PDFDownloadLink
              document={<PdfFile order={finishedShowerPdf} cart={cart} />}
              fileName={`Дашки менеджер ${new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '-')}.pdf`}
            >
              {({ loading, error }) =>
                loading ? "завантаження..." : "Для менеджера"
              }
            </PDFDownloadLink>
            <PDFDownloadLink
              className=""
              document={<PdfFileClient order={finishedShowerPdf} />}
              fileName={`Дашки клієнт ${new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '-')}.pdf`}
            >
              {({ loading, error }) =>
                loading ? "завантаження..." : "Для клієнта"
              }
            </PDFDownloadLink>
          </div>
          <button onClick={handleFetch}>Оформити</button>
        </div>
      </div> */}
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
                     glassProcessingCountArr = {glassProcessingCountArr}
                     glassProcessingArr = {glassProcessingArr}
                     />}
                  fileName={`Дашки менеджер ${new Date()
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
                  document={<PdfFileClient order={finishedShowerPdf} />}
                  fileName={`Дашкии клієнт ${new Date()
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

export default Dashki;
