import React,{useEffect, useRef, useState} from "react";
import axios from 'axios';

function Test() {

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
      };

    const handleUpload = () => {


        // console.log(selectedImage)



        fetch("https://cdn.discordapp.com/attachments/1070777983108919526/1137609428267450398/187.jpg")
          .then((response) => response.blob())
          .then((imageBlob) => {
            const file = new File([imageBlob], 'Test.jpg', { type: imageBlob.type });
            const formData = new FormData();
            formData.append('fileData', file);
 
            axios.post('http://localhost:2500/api/data',formData).then((res)=>{
                console.log(res);
            }).catch((err)=>{
                console.log(err)
            })
          })
          .catch((error) => {
            // Handle errors if the image fetch fails.
          });
      };

    useEffect(() => {
        handleUpload()
    }, []);


    return ( 
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload Image</button>
        </div>
     );
}

export default Test;