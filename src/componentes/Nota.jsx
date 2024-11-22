import {
  Table,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Button,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Nota() {
  const [data, setData] = useState([]);
  const [dataUsuario, setDataUsuario] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);

  const nameUser = dataUsuario.map((item) => item.nombre);

  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = nameUser.filter((o) => !selectedItems.includes(o));

  const showModal = () => {
    setIsModalOpen(true);
    setIsUpdate(false);
  };

  const showModalEdit = async (id) => {
    try {
      setIsModalOpen(true);
      setIsUpdate(true);
      let response = await axios.get(`http://localhost:3000/notas/${id}`);
      console.log(response.data, "soy response");

      
      form.setFieldsValue({
        id: response.data.id,
        nota: response.data.nota,
        user_ID: response.data.User.id,
        userName: response.data.User.nombre
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const confirm = async (id) => {
    await axios.delete(`http://localhost:3000/notas/${id}`);
    getData();
  };

  const getData = async () => {
    try {
      let response = await axios.get("http://localhost:3000/notas");
      let responseU = await axios.get(`http://localhost:3000/usuarios`);
      const dataWithUserNames = response.data.map((nota) => {
        const user = responseU.data.find((usuario) => usuario.id === nota.User.id);
        return { ...nota, User: user };
      });
      setData(dataWithUserNames);
      setDataUsuario(responseU.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values) => {
    const idNotas = values.id;
    const { id, ...data } = values;
    try {
      if (isUpdate) {
        await axios.put(`http://localhost:3000/notas/${idNotas}`, data);
      } else {
        await axios.post(`http://localhost:3000/notas`, values);
      }
      getData();
      form.resetFields();
      handleCancel();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nota",
      dataIndex: "nota",
      key: "nota",
    },
    {
      title: "Usuario",
      dataIndex: ["User", "nombre"],
      key: "nombre",
    },
    {
      title: "UserID",
      dataIndex: ["User", "id"],
      key: "userId",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (value, row) => {
        return (
          <>
            <Button
              type="default"
              onClick={() => showModalEdit(row.id)}
              style={{ marginRight: "4px" }}
            >
              Editar
            </Button>

            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this task?"
              okText="Yes" 
              cancelText="No"
              onConfirm={() => confirm(row.id)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Agregar Nota
      </Button>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="id" hidden>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="nota"
            rules={[{ required: true, message: "Please input your note!" }]}
          >
            <Input placeholder="Nota" />
          </Form.Item>
          <Form.Item
            name="user_ID"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select
              style={{ width: "100%" }}
              options={dataUsuario.map((item) => ({
                value: item.id,
                label: item.nombre,
              }))}
            />
          </Form.Item>
          <Form.Item>
            {isUpdate ? (
              <Button block type="primary" htmlType="submit">
                Update
              </Button>
            ) : (
              <Button block type="primary" htmlType="submit">
                Create
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Row>
        <Col md={24} style={{ display: "flex", justifyContent: "center" }}>
          <Table rowKey="id" dataSource={data} columns={columns} />
        </Col>
      </Row>
    </>
  );
}

export default Nota;
