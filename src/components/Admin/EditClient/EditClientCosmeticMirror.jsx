import React, { useState, useEffect } from "react";
import '../../../style/edir-shower.scss';
import '../../../style/admin.scss'
import O_EditProcessingСutoutTempalte from "../EditTemplate/O_EditProcessingСutoutTempalte";
import O_EditTypeAndPhotoTemplate from "../EditTemplate/O_EditTypeAndPhotoTemplate";
import O_EditSizeTemplate from "../EditTemplate/O_EditSizeTemplate";
import N_EditLightBulsTemplate from "../EditTemplate/N_EditLightBulsTemplate";
import N_EditPatronTemplate from "../EditTemplate/N_EditPatronTemplate";
import AdminHeader from '../AdminClientHeader';

const EditClientCosmeticMirror = () => {
    const [currentObject, setCurrentObject] = useState({});
    const [showTypeBlock, setShowTypeBlock] = useState(true);
    const [newValueTypeName, setNewValueTypeName] = useState('');
    const [newValueTypePrice, setNewValueTypePrice] = useState('');
    const [isFtch, setIsFetch] = useState(false);
    
    useEffect(() => {
        fetch("https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/get-all-cosmetic-mirrors")
          .then((res) => res.json())
          .then((data) => {
            setCurrentObject(data[0]);
          })
          .catch((error) => console.error(error));
      }, [isFtch]);

      const handleAddNewType = () => {    
        fetch('https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/add-new-client-cosmetic-mirrors-type', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newValueTypeName,
            price: newValueTypePrice,
            showerId: currentObject._id
          })
        })
          .then((res) => res.json())
          setTimeout(() => {
            // window.location.reload();
            setIsFetch(state=>!state);
            setNewValueTypeName('');
            setNewValueTypePrice('');
          },1000)
      }

    return (
        <div>
          <AdminHeader/>
            <div className="shower-cabin-edit-header">
            <h1 className={`header_item ${showTypeBlock ? 'active_tab' : ''}`}  onClick={() => setShowTypeBlock(state=>!state)}>Типи</h1>
            </div>
            {showTypeBlock && currentObject?.typeWordpress && currentObject.typeWordpress.map((el, idx) => (
                <O_EditTypeAndPhotoTemplate el={el} key={idx} showerId={currentObject._id}
                setIsFetch={setIsFetch}
                pathEdit='https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/update-client-cosmetic-mirrors-type'
                pathDelete='https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/remove-client-cosmetic-mirrors-type'
                pathEditPhoto='https://sklo-expert-server-v2-008be2d9257c.herokuapp.com/update-client-cosmetic-mirrors-type-image'/>
            ))
            }
            {showTypeBlock && 
            <>
            <input className=" edit_new_glass_input edit_new_glass-color_input" placeholder="Назва" value={newValueTypeName} onChange={(e) => setNewValueTypeName(e.target.value)}/>
            <input className=" edit_new_glass_input edit_new_glass-color_input" placeholder="Ціна" value={newValueTypePrice} onChange={(e) => setNewValueTypePrice(e.target.value)}/>
            <button className=" edit_new_glass_button edit_new_glass-color_button" onClick={handleAddNewType}>Додати новий</button>
            </>
            }
        </div>
    );
};

export default EditClientCosmeticMirror;