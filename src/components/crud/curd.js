import { useReducer, useEffect, useState } from "react";
import reducer, { initState } from "./recuder";
import "./index.scss"
import { Button, Modal, Form, Pagination } from "react-bootstrap";
import {
  listItem,
  setItem,
  addItem,
  detailItem,
  updateItem,
  deleteItem,
} from "./actions";

import axios from "axios";
function Crud({ resource, fields, options }) {
  const [state, dispatch] = useReducer(reducer, initState);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectValue, setSelectValue] = useState("");

  
  const { item, items } = state;
  useEffect(() => {
    list();
   
  }, [page]);
  console.log(options);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({})
    setId("")
    setSelectValue("")
    setShowModal(false);
  };
  const list = () => {
    axios
      .get(`http://localhost:8080/api/${resource}/hien-thi?pageNo=${page}`)
      .then((response) => {
        dispatch(listItem(response.data.content));
        setTotalPages(response.data.totalPages);
        console.log(items.content);
        console.log(state.items);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      
  };


    const handleAdd = () => {
      console.log(formData);

      axios
      .post(`http://localhost:8080/api/${resource}/add`,formData)
      .then((response) =>{
        dispatch(addItem(response.data))
        list()
        console.log(response.data);
        setFormData({})
        handleCloseModal()
      })
      .catch((error) => {
        console.log(error);
      });
    };
    const handleDetail =(ids) =>{
     
      axios
      .get(`http://localhost:8080/api/${resource}/${ids}`)
      .then((response) =>{
       setFormData(response.data);
       setSelectValue(response.data.lop.id); 
       setShowModal(true);
       setId(ids)
        console.log(response.data.lop.id);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    const handleSubmit = () => {
      console.log(id);
      if(!id){
        if(formData.idLop == null){
          alert('Chọn lớp')
        }else{
          axios
          .post(`http://localhost:8080/api/${resource}/add`,formData)
          .then((response) =>{
            dispatch(addItem(response.data))
            list()
            console.log(response.data);
            setFormData({})
            handleCloseModal()
          })
          .catch((error) => {
            console.log(error);
          });
        }
       
        console.log(id);
      }else{
       
        axios
        .put(`http://localhost:8080/api/${resource}/update/${id}`,formData)
        .then((response) =>{
          dispatch(updateItem(response.data))
          list()
          setFormData({})
          setId("")
          setSelectValue("")
          handleCloseModal()
        })
        .catch((error) => {
          console.log(error);
        });
      }
    
      
    };

    const handleDelete  =(id) =>{
      axios
      .delete(`http://localhost:8080/api/${resource}/delete/${id}`)
      .then((response) =>{
        dispatch(deleteItem(response.data))
        list()
      })
      .catch((error) => {
        console.log(error);
      });
    }
    const handlePreviousPage = () => {
      if (page > 0) {
        setPage(page - 1);
      }
    };
  
    const handleNextPage = () => {
      if (page < totalPages - 1) {
        setPage(page + 1);
      }
    };


  return (
    <div className="container">
       <Button variant="primary" onClick={handleOpenModal}>
        Add
      </Button>
      <br /> <br /> <br />
      <table className="table">
  <thead>
    <tr>
      {fields.map((field) => (
         
          <th className="line-table"  key={field.name}>{field.label}</th>
        
      ))}
      <th className="line-table" >Actions</th>
    </tr>
  </thead>
  <tbody>
    {items.length === 0 ? (
      <tr>
        <td className="no-data" colSpan={fields.length + 1}>Không có dữ liệu</td>
      </tr>
    ) : (
      items.map((item) => (
        <tr className="tr-table"  key={item.id}>
          {fields.map((field) => (
            <td   key={field.name}>
              <div  className="td-table">
              {field.name === "idLop" ? item.lop.tenLop : item[field.name]}
              </div>
            </td>
          ))}
          <td >
            <Button 
              variant="primary"
              onClick={() => handleDelete(item.id)}
              className="td-table"
            >
              Delete
            </Button>
            <Button variant="primary" onClick={() => handleDetail(item.id)}>
              Detail
            </Button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

      <div className="pagination-container">
        <Pagination>
          <Pagination.Prev
            disabled={page === 0}
            onClick={handlePreviousPage}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index === page}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPages - 1}
            onClick={handleNextPage}
          />
        </Pagination>
      </div>

    
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {fields.map((field) => (
              <div key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === "select" ? (
                  <Form.Select
                    name={field.name}
                    value={  formData[field.name]  || selectValue || ""}
                    onChange={handleChange}
                  >
                    {field.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.tenLop}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            
          {id ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
}

export default Crud;
