import { useEffect, useState } from "react";
import Crud from "../crud/curd";
import axios from "axios";

function SinhVien() {
  
  const [lopOptions, setLopOptions] = useState([]);

 

  const sinhVienFields = [
    {
      name: "maSinhVien",
      label: "Mã",
      type: "text",
      placeholder: "ma",
    },
    {
      name: "tenSinhVien",
      label: "Tên",
      type: "text",
      placeholder: "ten",
    },
    {   
    
        name: 'idLop',
        label: 'Lớp',
        type: 'select',
        options:  lopOptions
    
      
    },
   
    
  ];
  useEffect(() => {
    // Gọi API để lấy dữ liệu của bảng lớp
    axios.get(`http://localhost:8080/api/lop/hien-thi`)
      .then((response) => {
        // Lưu trữ dữ liệu vào biến lopOptions
        setLopOptions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return(
    <div >
        <h2>CRUD Sinh vien</h2>
        <Crud resource="sinh-vien" fields={sinhVienFields} options ={lopOptions}/>
    </div>
  )
}
export default SinhVien;
